import olFormatGeoJSON from 'ol/format/geojson'
import olFormatKml from 'ol/format/kml'
import shpwrite from 'shp-write' // mapbox shapefile writer
import olFeature from 'ol/feature'
import ugh from 'ugh'

const fs = require('fs') // fs is used to test downloads with jest in a node env

function groupBy (list, getGroupName) {
  return list.reduce((groups, item) => {
    const val = getGroupName(item)

    groups[val] = groups[val] || []
    groups[val].push(item)

    return groups
  }, {})
}

/**
 * Exports the passed features as a file of the desired type.
 * @category LayerPanel
 * @function
 * @since 0.9.0
 * @param {String} [type] - The desired file type ('shp' or 'kml').
 * @param {Object[]} [features] - An array of the features to be included in the generated file.
 */
export function exportFeatures (type, features, opts) {
  const visibleFeatures = features.map(feature => {
    const clone = feature.clone()

    // this removes a ref to _ol_kit_parent to solve circularJSON bug
    clone.set('_ol_kit_parent', null)
    clone.setId(feature.getId())

    return clone
  }).filter(feature => feature.get('_ol_kit_feature_visibility'))

  switch (type) {
    case 'shp':
      return exportShapefile({
        format: new olFormatGeoJSON(),
        visibleFeatures,
        sourceProjection: 'EPSG:3857',
        ...opts
      })
    case 'kml':
      return exportKml({
        format: new olFormatKml(),
        visibleFeatures,
        sourceProjection: 'EPSG:3857',
        targetProjection: 'EPSG:4326',
        ...opts
      })
    default:
      return exportGeoJSON({
        format: new olFormatGeoJSON(),
        visibleFeatures,
        sourceProjection: 'EPSG:3857',
        ...opts
      })
  }
}

function saveAs (blob, filename) {
  try {
    // create an <a> element
    const a = document.createElement('a')
    // create an object URL from our blob
    const url = URL.createObjectURL(blob)
    // set our element properties
    a['data-testid'] = 'Export.download'
    a.href = url
    a.download = filename
    a.style = 'display: none;'
    // append to the document so we can click it
    document.body.appendChild(a)
    // download the file
    a.click()
    // clean-up
    URL.revokeObjectURL(url)
    document.body.removeChild(a)
  } catch (err) {
    ugh.error(`There was a problem downloading the exported file: ${err.message}`)
  }
}

function flattenFeatures (features) {
  return features.reduce((acc, feature) => {
    const geom = feature.getGeometry()
    const type = geom.getType()
    switch (type) {
      default:
        acc.push(feature)
        break
      case 'MultiPoint': {
        const featureProps = feature.getProperties()
        geom.getPoints().forEach(point => {
          acc.push(new olFeature({ ...featureProps, geometry: point }))
        })
        break
      }
      case 'MultiLineString': {
        const featureProps = feature.getProperties()
        geom.getLineStrings().forEach(lineString => {
          acc.push(new olFeature({ ...featureProps, geometry: lineString }))
        })
        break
      }
      case 'MultiPolygon': {
        const featureProps = feature.getProperties()
        geom.getPolygons().forEach(polygon => {
          acc.push(new olFeature({ ...featureProps, geometry: polygon }))
        })
        break
      }
      case 'GeometryCollection': {
        const featureProps = feature.getProperties()
        const spreadFeatures = geom.getGeometriesArray().map(g => new olFeature({ ...featureProps, geometry: g }))
        const flattenedFeatures = flattenFeatures(spreadFeatures) // GeometryCollections can contain Multi geometries so we call flattenFeatures recusively

        flattenedFeatures.forEach(f => {
          acc.push(f)
        })
        break
      }
    }

    return acc
  }, [])
}

function exportShapefile ({ format, visibleFeatures, sourceProjection, targetProjection = 'EPSG:4326', filename = 'export.zip' }) {
  const flattenedFeatures = flattenFeatures(visibleFeatures) // as of writing this shpwrite is bugged and can't handle multi geometries or GeometryCollections so we flatten these into their constituent parts.
  const featureCollection = format.writeFeaturesObject(flattenedFeatures, {
    dataProjection: targetProjection,
    featureProjection: sourceProjection
  })

  const types = Array.from(new Set(featureCollection.features.map(feature => feature.geometry.type)))
  const options = { folder: filename, types  }

  return shpwrite.download(featureCollection, options)
}

function exportGeoJSON ({ format, visibleFeatures, sourceProjection, targetProjection = 'EPSG:4326', filename = 'export.geojson' }) {
  const featureCollection = format.writeFeaturesObject(visibleFeatures, {
    dataProjection: targetProjection,
    featureProjection: sourceProjection
  })
  const jsonString = JSON.stringify(featureCollection)

  // download the file for testing in a node env
  fs?.writeFileSync?.(filename, jsonString, { encoding: 'utf8' })

  return saveAs(new Blob([jsonString], {type: "octet/stream"}), filename)
}

function exportKml (args) {
  const {
    format,
    visibleFeatures,
    sourceProjection,
    targetProjection = 'EPSG:4326',
    filename = 'export.kml'
  } = args
  const source = format.writeFeatures(visibleFeatures, {
    dataProjection: targetProjection,
    featureProjection: sourceProjection
  })
  const blob = new Blob([source], { type: 'kml' })

  // download the file for testing in a node env
  fs?.writeFileSync?.(filename, source, { encoding: 'utf8' }) // fs is used for testing the download in node

  return saveAs(blob, filename)
}
