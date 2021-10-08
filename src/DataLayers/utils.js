import olVectorSource from 'ol/source/Vector'
import olStyle from 'ol/style/Style'
import olCircleStyle from 'ol/style/Circle'
import olFill from 'ol/style/Fill'
import olStroke from 'ol/style/Stroke'
import Map from 'ol/Map'
import GeoJSON from 'ol/format/GeoJSON'
import KML from 'ol/format/KML'
import { VectorLayer } from 'classes'
import ugh from 'ugh'

const getFeaturesFromDataSet = (map, dataSet) => {
  const mapProjection = map.getView().getProjection().getCode()
  const opts = { featureProjection: mapProjection }

  try {
    const geoJson = new GeoJSON(opts)
    const features = geoJson.readFeatures(dataSet)

    return features
  } catch (e) { /* must not be JSON */ }
  try {
    const kml = new KML({ extractStyles: false })
    const features = kml.readFeatures(dataSet, opts)

    return features
  } catch (e) { /* must not be KML */ }

  // not a supported data format, return empty features array
  return []
}

const urlValidator = string => {
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
 * @param {String} [opts.title] - set custom title on layer (default: "Data Layer")
 * @returns {ol.Layer} Promise that resolves with the newly created data layer
 */
export const loadDataLayer = async (map, query, optsArg = {}) => {
  if (!(map instanceof Map)) return ugh.throw('\'loadDataLayer\' requires a valid openlayers map as the first argument')
  const style = { fill: { color: '#fefefe91' }, stroke: { color: '#3399cd', width: 2 }, ...optsArg.style }
  const opts = { addToMap: true, title: 'Data Layer 69', ...optsArg }

  // getFeaturesFromDataSet returns empty array if query arg is not a supported data type (ex. url)
  let features = getFeaturesFromDataSet(map, query)
  const isValidUrl = urlValidator(query)

  if (!features.length && isValidUrl) {
    // query is an endpoint to fetch valid data set
    let response

    try {
      const request = await fetch(query)

      response = await request.text() // either xml or json
    } catch (e) {
      return ugh.throw(`'loadDataLayer' error when making network request:`, e)
    }

    let dataSet

    try {
      // geojson
      dataSet = JSON.parse(response)
    } catch (e) {
      // kml
      const parser = new DOMParser()

      dataSet = parser.parseFromString(response, 'text/xml')
    }

    features = getFeaturesFromDataSet(map, dataSet)
  } else if (!features.length) {
    // catch malformed queries here
    return ugh.throw(`'loadDataLayer' recieved invalid query: '${query}' as second argument`)
  }

  // create the layer and add features
  const source = new olVectorSource()
  const layer = new VectorLayer({ source })

  // set attribute for LayerPanel title
  layer.set('title', opts.title)
  if (isValidUrl) layer.set('_ol_kit_data_source', query)

  features.forEach(feature => feature.set('_ol_kit_parent', layer))
  source.addFeatures(features)

  // style based on opts
  layer.setStyle(
    new olStyle({
      fill: new olFill(style.fill),
      stroke: new olStroke(style.stroke),
      image: new olCircleStyle({
        radius: 4,
        fill: new olFill(style.fill),
        stroke: new olStroke(style.stroke)
      })
    })
  )

  // conditionally add this new layer to the map
  if (opts.addToMap) map.addLayer(layer)

  return layer
}
