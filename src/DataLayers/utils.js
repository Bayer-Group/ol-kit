import olVectorLayer from 'ol/layer/vector'
import olVectorSource from 'ol/source/vector'
import Map from 'ol/map'
import GeoJSON from 'ol/format/geojson'
import KML from 'ol/format/kml'
import ugh from 'ugh'

const getFeaturesFromDataSet = dataSet => {
  try {
    const geoJson = new GeoJSON({ featureProjection: 'EPSG:3857' }) // TODO check map projection
    const features = geoJson.readFeatures(dataSet)

    return features
  } catch (e) { /* must not be JSON */ }
  try {
    const kml = new KML()
    const features = kml.readFeatures(dataSet)

    return features
  } catch (e) { /* must not be KML */ }

  // not a supported data format, return empty features array
  return []
}

const getLocalDataSet = arg => {
  let dataSet = null

  try {
    dataSet = require(`../../data/${arg}.json`)
  } catch (e) { /* must not be JSON */ }
  try {
    dataSet = require(`../../data/${arg}.kml`)
  } catch (e) { /* must not be KML */ }

  return dataSet
}

const isValidUrl = string => {
  try {
    new URL(string)
  } catch (_) {
    return false
  }

  return true
}

export const createDataLayer = (arg, styleArg) => {
  const dataSet = getLocalDataSet(arg)
  const features = getFeaturesFromDataSet(dataSet)
  const layer = new olVectorLayer({ source: new olVectorSource() })
  const source = layer.getSource()

  features.forEach((feature, i) => {
    source.addFeature(feature)
  })

  // layer.setStyle(
  //   new olStyle({
  //     fill: new olFill(style.fill),
  //     stroke: new olStroke(style.stroke)
  //   })
  // )

  return layer
}

/**
 * Async fetch for data layers - supports geojson, kml
 * @function
 * @category DataLayers
 * @since 0.3.0
 * @param {ol.Map} map - reference to the openlayer map object
 * @param {String} query - key to pull from predefined data set, url pointing to geojson or kml file, or geojson/kml file itself
 * @param {Object} [opts] - Object of optional params
 * @param {Boolean} [opts.addToMap] - opt out of adding the layer to the map (default true)
 * @param {String} [opts.style] - style object used to apply styles to the layer
 * @returns {ol.Layer} Promise that resolves with the newly created data layer
 */
export const loadDataLayer = async (map, query, optsArg = {}) => {
  if (!(map instanceof Map)) return ugh.throw('\'loadDataLayer\' requires a valid openlayers map as the first argument')
  const opts = { addToMap: true, ...optsArg }

  let features = []
  const localDataSet = getLocalDataSet(query) // check query against ./data dir to get data file
  const featuresFromQuery = getFeaturesFromDataSet(query) // returns empty array if query is unsupported data type

  if (localDataSet) {
    // query is a string to request local data set
    features = getFeaturesFromDataSet(localDataSet)
  } else if (featuresFromQuery.length) {
    // query passed is valid data file
    features = featuresFromQuery
  } else if (isValidUrl(query)) {
    // query is an endpoint to fetch valid data set
    const request = await fetch(query)
    const dataSet = await request.json()

    features = getFeaturesFromDataSet(dataSet)
  } else {
    // catch malformed queries here
    return ugh.throw('Pass a valid query to \'loadDataLayer\' as second argument')
  }

  // create the layer and add features
  const layer = new olVectorLayer({ source: new olVectorSource() })
  const source = layer.getSource()

  features.forEach((feature, i) => {
    source.addFeature(feature)
  })

  // layer.setStyle(
  //   new olStyle({
  //     fill: new olFill(style.fill),
  //     stroke: new olStroke(style.stroke)
  //   })
  // )

  if (opts.addToMap) map.addLayer(layer)

  return layer
}
