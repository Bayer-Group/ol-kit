import JSZip from 'jszip'

import olSourceVector from 'ol/source/Vector'
import olCollection from 'ol/Collection'
import olLayerVector from 'ol/layer/Vector'
import olFeature from 'ol/Feature'
import olGeomPoint from 'ol/geom/Point'
import olFormatFeature from 'ol/format/Feature'
import olFormatWKT from 'ol/format/WKT'
import olFormatGeoJSON from 'ol/format/GeoJSON'
import olFormatKML from 'ol/format/KML'

import Papa from 'papaparse'
import shp from 'shpjs'

export function arrRegexIndexOf (arr, re) {
  for (const i in arr) {
    if (arr[i].match(re)) {
      return Number(i)
    }
  }

  return -1
}

/**
 * Converts the given file into a layer
 * @function convertFileToLayer
 * @category LayerPanel
 * @since 6.5.0
 * @param {Blob} [file] - the file to be converted.  Accepts, 'kmz', 'kml', 'geojson', 'wkt', 'csv', 'zip', and 'json' file types.
 * @param {olMap} [map] - the openlayers map
 */
export function convertFileToLayer (file, map) {
  return new Promise((resolve, reject) => {
    read(file)
      .then(getFormatForFileType)
      .then((res) => {
        resolve({
          name: file.name,
          layer: convertFormatToLayer(res, map, file.name)
        })
      })
      .catch(reject)
  })
}

/**
 * Converts the given file into an array of features
 * @function convertFileToFeatures
 * @category LayerPanel
 * @since 7.0.0
 * @param {Blob} [file] - the file to be converted.  Accepts, 'kmz', 'kml', 'geojson', 'wkt', 'csv', 'zip', and 'json' file types.
 * @param {olMap} [map] - the openlayers map
 */
export function convertFileToFeatures (file, map) {
  return new Promise((resolve, reject) => {
    read(file)
      .then(getFormatForFileType)
      .then((res) => {
        resolve({
          name: file.name,
          features: convertFormatToFeatures(res, map)
        })
      })
      .catch(reject)
  })
}

const acceptedExtensions = [
  'kmz',
  'kml',
  'geojson',
  'wkt',
  'csv',
  'zip',
  'json'
]

export function validFile (file, fileTypes) {
  return file && fileTypes.find((type) => file.name.endsWith(type.extension.toLowerCase()))
}

export function createFeaturesVectorSource (features = []) {
  const vectorSource = new olSourceVector({
    wrapX: true
  })

  vectorSource.addFeatures(features)

  return vectorSource
}

export function stackedJsonStringToJsonArray (stackedJsonString) {
  const splitString = stackedJsonString.split('}{')

  return splitString.map((s) => {
    let jsonString = s

    if (!(s[0] === '{')) jsonString = `{${jsonString}`
    if (!(s[s.length - 1] === '}')) jsonString = `${jsonString}}`

    return JSON.parse(jsonString)
  })
}

export function jsonArrayToFeatureArray (jsonArray, format) {
  // Convert Array<JSON> into Array<Array<Features>>
  const deepFeaturesArray = jsonArray.map((json) => {
    return format.readFeatures(json)
  })

  // Return flattened Array<Features> results using reduce
  return deepFeaturesArray.reduce((accumulator, value) => {
    return accumulator.concat(value)
  }, [])
}

export function getFeaturesFromFormat (format, results) {
  if (!format || !results) return []
  // The conversion service returns stacked feature collections (e.g. '{FeatureCollection}{FeatureCollection}{FeatureCollection}') when there are multiple shapefiles within the payload zip archive
  if (typeof results === 'string' && results.includes('}{')) {
    const jsonArray = stackedJsonStringToJsonArray(results)

    return jsonArrayToFeatureArray(jsonArray, format)
  } else {
    return format.readFeatures(results)
  }
}

export function transformFeature (opts) {
  const getCode = args => {
    const {
      code,
      projection,
      map
    } = args

    if (code) {
      return code
    } else if (projection) {
      return projection.getCode()
    } else {
      try {
        return map.getView().getProjection().getCode()
      } catch (e) {
        throw new Error('Arguments are invalid.')
      }
    }
  }
  const proj = getCode(opts)

  return new olFeature({ ...opts.feature.getProperties(), geometry: opts.feature.clone().getGeometry().transform('EPSG:4326', proj) })
}

export function convertFormatToLayer({ format, results }, map, fileName) {
  const features = convertFormatToFeatures({ format, results }, map, fileName)

  const buildLayer = (feats) => {
    return new olLayerVector({
      source: createFeaturesVectorSource(feats),
      renderMode: 'image',
      name: fileName
    })
  }
  return Array.isArray(features) ? features.map(buildLayer) : [buildLayer(features)]
}

export function convertFormatToFeatures({ format, results }, map) {
  if (!format || !results) throw new Error('File failed to properly')

  const getFeatures = (res) => {
    if (res instanceof olCollection) return res.getArray()

    return getFeaturesFromFormat(format, res)
  }
  const nonGeomFeatures = f => f.getGeometry()
  const convert = (res) => {
    return {
      featureArray: (getFeatures(res)
        .filter(nonGeomFeatures)
        .map(feature => transformFeature({ feature, map }))),
      fileName: res.fileName
    }
  }

  return Array.isArray(results) ? results.map(convert) : [convert(results)]
}

export function getFileType (file) {
  return acceptedExtensions.find((type) => {
    return file.name.endsWith(type)
  })
}

export function getOlFormat (extension) {
  switch (extension.toLowerCase()) {
    case 'kml':
      return new olFormatKML()
    case 'geojson':
      return new olFormatGeoJSON()
    case 'json':
      return new olFormatGeoJSON()
    case 'wkt':
      return new olFormatWKT()
    default:
      return new olFormatGeoJSON()
  }
}

export function read (file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (val) => {
      resolve({
        file,
        reader,
        results: reader.result
      })
    }

    reader.onerror = (err) => reject(err)
    reader.readAsText(file)
  })
}

export function getFormatForFileType ({ file, reader, results }) {
  const extension = getFileType(file).toLowerCase()

  // If the type doesn't match the whitelist, bail
  if (!extension) throw new Error('File type is not supported')

  // for formats with no OL format, special flows are used
  if (extension === 'kmz') {
    return processKMZ(file)
  } else if (extension === 'zip') {
    return processShapefile(file)
  } else if (extension === 'csv') {
    return processCSV(reader.result)
  } else {
    return Promise.resolve({
      results: results,
      format: getOlFormat(extension)
    })
  }
}

export function processKMZ (file) {
  return JSZip.loadAsync(file).then(zip => {
    const match = zip.filter((relativePath, file) => {
      return relativePath.endsWith('.kml')
    })[0]

    return match.async('string')
  }).then(results => ({ format: new olFormatKML(), results }))
}

export function processShapefile (file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()

    fileReader.readAsArrayBuffer(file)
    fileReader.onloadend = function (e) {
      shp(e.target.result)
        .then(geojson => {
          resolve({
            results: geojson,
            format: new olFormatGeoJSON()
          })
        })
        .catch(reject)
    }
  })
}

export function processCSV (result) {
  return new Promise((resolve, reject) => {
    Papa.parse(result, {
      complete: (res) => {
        resolve(convertCsvArrayToCollection(res.data))
      }
    })
  })
}

export function convertCsvArrayToCollection (csvArr) {
  if (!csvArr || !(csvArr instanceof Array) || !csvArr.length) return false

  const columns = csvArr.shift()
  const longIndex = arrRegexIndexOf(columns, /^long(itude)?$/i)
  const latIndex = arrRegexIndexOf(columns, /^lat(itude)?$/i)

  if (latIndex < 0 || longIndex < 0) return false

  const features = csvArr.map((row) => {
    if (!Number(row[longIndex]) || !Number(row[latIndex])) return false

    const feature = new olFeature({
      geometry: new olGeomPoint([Number(row[longIndex]), Number(row[latIndex])])
    })

    const properties = {}

    columns.map((column, index) => {
      properties[column] = row[index] || ''
    })

    feature.setProperties(properties)

    return feature
  }).filter((t) => t)

  return {
    results: new olCollection(features),
    format: olFormatFeature
  }
}
