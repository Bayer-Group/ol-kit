import olVectorSource from 'ol/source/vector'
import olStyle from 'ol/style/style'
import olFill from 'ol/style/fill'
import olStroke from 'ol/style/stroke'
import Map from 'ol/map'
import GeoJSON from 'ol/format/geojson'
import KML from 'ol/format/kml'
import { VectorLayer } from 'classes'
import ugh from 'ugh'

const getFeaturesFromDataSet = (map, dataSet) => {
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

const isValidUrl = string => {
  try {
    new URL(string) // eslint-disable-line no-new
  } catch (_) {
    return false
  }

  return true
}

/**
 * Async fetch for data layers - supports geojson, kml
 * @function
 * @category DataLayers
 * @since 0.8.0
 * @param {ol.Map} map - reference to the openlayer map object
 * @param {String} query - url string pointing to geojson/kml file or the geojson/kml file itself
 * @param {Object} [opts] - Object of optional params
 * @param {Boolean} [opts.addToMap] - opt out of adding the layer to the map (default true)
 * @param {String} [opts.style] - style object used to apply styles to the layer
 * @returns {ol.Layer} Promise that resolves with the newly created data layer
 */
export const loadDataLayer = async (map, query, optsArg = {}) => {
  if (!(map instanceof Map)) return ugh.throw('\'loadDataLayer\' requires a valid openlayers map as the first argument')
  const style = { fill: { color: '#7FDBFF33' }, stroke: { color: '#0074D9', width: 2 }, ...optsArg.style }
  const opts = { addToMap: true, ...optsArg }

  // getFeaturesFromDataSet returns empty array if query arg is not a supported data type (ex. url)
  let features = getFeaturesFromDataSet(map, query)

  if (!features.length && isValidUrl(query)) {
    // query is an endpoint to fetch valid data set
    const request = await fetch(query)
    const dataSet = await request.json()

    features = getFeaturesFromDataSet(map, dataSet)
  } else if (!features.length) {
    // catch malformed queries here
    return ugh.throw(`'loadDataLayer' recieved invalid query: '${query}' as second argument`)
  }

  // create the layer and add features
  const source = new olVectorSource()
  const layer = new VectorLayer({ source })

  // set attribute for LayerPanel title
  layer.set('title', 'Data Layer')

  source.addFeatures(features)

  // style based on opts
  layer.setStyle(
    new olStyle({
      fill: new olFill(style.fill),
      stroke: new olStroke(style.stroke)
    })
  )

  // conditinally add this new layer to the map
  if (opts.addToMap) map.addLayer(layer)

  return layer
}
