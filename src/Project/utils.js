import Map from 'ol/Map'
import LayerVector from 'ol/layer/Vector'
import GeoJSON from 'ol/format/GeoJSON'
import { loadDataLayer } from 'DataLayers'
import { loadBasemapLayer } from 'Basemaps'
import { transform } from 'ol/proj'
import { centerAndZoom } from 'Map'
import ugh from 'ugh'
import packageJson from '../../package.json'
const { version } = packageJson
const readOpts = { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' }

/**
 * A utility that takes map state and outputs it as a project file
 * @function
 * @category Project
 * @since 1.9.0
 * @param {Map} - a reference to openlayers map
 * @returns {object} - object in ol-kit project format
 */
export async function createProject (map) {
  if (!(map instanceof Map)) return ugh.throw('\'createProject\' requires a valid openlayers map as the first argument')

  const rawLayers = map.getLayers().getArray()
  const layers = rawLayers.map(layer => {
    const keys = layer.getKeys()
    const values = {}

    keys.forEach(key => {
      const value = layer.get(key)
      // some key/values are too large to store in the project file metadata
      const safeValueCheck = key => (typeof key === 'string' || typeof key === 'boolean' || typeof key === 'number')

      if (safeValueCheck(value)) values[key] = value
    })
    const isVectorLayer = layer instanceof LayerVector || layer.isVectorLayer

    if (isVectorLayer && !layer.get('_ol_kit_data_source')) {
      // this is a vector layer that was created within ol-kit; get the feature geometries
      const features = layer.getSource().getFeatures()

      features.forEach(feature => feature.set('_ol_kit_parent', null))
      const geoJson = new GeoJSON({ featureProjection: 'EPSG:3857' }).writeFeatures(features)

      values._ol_kit_project_geojson = geoJson
    }

    return values
  })
  const coords = transform(map.getView().getCenter(), map.getView().getProjection().getCode(), 'EPSG:4326')
  const x = parseFloat(coords[0]).toFixed(6)
  const y = parseFloat(coords[1]).toFixed(6)
  const zoom = parseFloat(map.getView().getZoom()).toFixed(2)
  const rotation = parseFloat(map.getView().getRotation()).toFixed(2)
  const outputFile = {
    version,
    layers,
    view: {
      x,
      y,
      zoom,
      rotation
    }
  }

  return outputFile
}

/**
 * A utility that accepts an ol-kit project file and updates the map state
 * @function
 * @category Project
 * @since 1.9.0
 * @param {Map} - a reference to openlayers map
 * @returns {object} - object in ol-kit project format
 */
export async function loadProject (map, project) {
  if (!(map instanceof Map)) return ugh.throw('\'loadProject\' requires a valid openlayers map as the first argument')

  // clear old layers from current map
  map.getLayers().getArray().forEach(layer => map.removeLayer(layer))

  const { layers, view } = project

  layers.forEach(layerData => {
    const opts = {
      title: layerData.title
    }

    if (layerData?._ol_kit_basemap) {
      // set the basemap
      loadBasemapLayer(map, layerData._ol_kit_basemap)
    } else if (layerData?._ol_kit_project_geojson) {
      // create layer based off geometries
      const geoJson = new GeoJSON()
      const features = geoJson.readFeatures(layerData._ol_kit_project_geojson, readOpts)
      const geoJsonFile = geoJson.writeFeaturesObject(features, { featureProjection: 'EPSG:3857' })

      loadDataLayer(map, geoJsonFile, opts)
    } else if (layerData?._ol_kit_data_source) {
      // fetch the external
      loadDataLayer(map, layerData._ol_kit_data_source, opts)
    } else {
      ugh.error(`Layer (title: ${layerData.title}) failed to load from project file!`)
    }
  })

  // load view from project
  const { rotation, x, y, zoom } = view

  centerAndZoom(map, { x, y, zoom })
  map.getView().animate({
    rotation,
    duration: 0
  })
}
