import olFormatGeoJSON from 'ol/format/geojson'
import olFormatKml from 'ol/format/kml'
import shpwrite from 'shp-write' // mapbox shapefile writer
import olFeature from 'ol/feature'

export function groupBy (list, getGroupName) {
  return list.reduce((groups, item) => {
    const val = getGroupName(item)

    groups[val] = groups[val] || []
    groups[val].push(item)

    return groups
  }, {})
}

/**
 * Exports the passed features as a file of the desired type.
 * @function exportFeatures
 * @since 
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
  }).filter(feature => feature.get('_vmf_visible') || feature.get('_ol_kit_feature_visibility'))

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

export function saveAs (blob, filename) {
  // create an <a> element
  const a = document.createElement('a')
  // create an object URL from our blob
  const url = URL.createObjectURL(blob)

  // set our element properties
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
}

export function flattenFeatures (features) {
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

export function exportShapefile ({ format, visibleFeatures, sourceProjection, targetProjection = 'EPSG:4326', filename = 'export.zip' }) {
  const flattenedFeatures = flattenFeatures(visibleFeatures) // as of writing this shpwrite is bugged and can't handle multi geometries or GeometryCollections so we flatten these into their constituent parts.
  const featureCollection = format.writeFeaturesObject(flattenedFeatures, {
    dataProjection: targetProjection,
    featureProjection: sourceProjection
  })

  const types = Array.from(new Set(featureCollection.features.map(feature => feature.geometry.type)))
  const options = { folder: filename, types  }

  return shpwrite.download(featureCollection, options)
}

export function exportGeoJSON ({ format, visibleFeatures, sourceProjection, targetProjection = 'EPSG:4326', filename = 'export.geojson' }) {
  const featureCollection = format.writeFeaturesObject(visibleFeatures, {
    dataProjection: targetProjection,
    featureProjection: sourceProjection
  })

  return saveAs(new Blob([JSON.stringify(featureCollection)], {type: "octet/stream"}), filename)
}

export function exportKml (args) {
  const {
    format,
    visibleFeatures,
    sourceProjection,
    targetProjection = 'EPSG:4326'
  } = args
  const source = format.writeFeatures(visibleFeatures, {
    dataProjection: targetProjection,
    featureProjection: sourceProjection
  })
  const blob = new Blob([source], { type: 'kml' })
  const filename = 'export.kml'

  return saveAs(blob, filename)
}

export function smoothFeatureAttributes (geojsonFeatures) {
  let allProps = {}

  // create an object of props as keys (since it takes care of dupes) & then grab just the keys
  geojsonFeatures.forEach(feature => {
    if (!feature.properties) feature.properties = {}
    Object.keys(feature.properties).forEach(function (prop) { allProps[prop] = true })
  })
  allProps = Object.keys(allProps)

  // for each feature determine if the prop should be removed or set to ''
  // an empty string corresponds to a null value in the output shapefile
  return geojsonFeatures.map(feature => {
    allProps.forEach(prop => {
      const hasProp = feature.properties.hasOwnProperty(prop)
      const propIsNull = feature.properties[prop] === null
      const isVmfProp = prop.startsWith('_vmf_')

      if (isVmfProp) {
        delete feature.properties[prop]
      } else if (!hasProp || (hasProp && propIsNull)) {
        feature.properties[prop] = ''
      }
    })

    return feature
  })
}
