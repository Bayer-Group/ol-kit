import Map from 'ol/Map'
import LayerVector from 'ol/layer/Vector'
import GeoJSON from 'ol/format/GeoJSON'
import { loadDataLayer } from 'DataLayers'
import { loadBasemapLayer } from 'Basemaps'
import ugh from 'ugh'
import { version } from '../../package.json'

/**
 * A utility that takes map state and outputs it as a project file
 * @function
 * @category Project
 * @since 1.9.0
 * @param {Map} - a reference to openlayers map
 * @returns {File} - a JSON file in ol-kit project format
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
      const geoJson = new GeoJSON().writeFeatures(features)

      values._ol_kit_project_geojson = geoJson
    }

    return values
  })
  const outputFile = {
    version,
    layers
  }

  return outputFile
}

/**
 * A utility that accepts an ol-kit project file and updates the map state
 * @function
 * @category Project
 * @since 1.9.0
 * @param {Map} - a reference to openlayers map
 * @param {File} - a JSON file in .olkprj format
 */
export async function loadProject (map, project) {
  if (!(map instanceof Map)) return ugh.throw('\'loadProject\' requires a valid openlayers map as the first argument')

  // clear old layers from current map
  map.getLayers().getArray().forEach(layer => map.removeLayer(layer))

  project.layers.forEach(layerData => {
    const opts = {
      title: layerData.title
    }

    if (layerData?._ol_kit_basemap) {
      // set the basemap
      loadBasemapLayer(map, layerData._ol_kit_basemap)
    } else if (layerData?._ol_kit_project_geojson) {
      // create layer based off geometries
      const geoJson = new GeoJSON()
      const features = geoJson.readFeatures(layerData._ol_kit_project_geojson)
      const geoJsonFile = geoJson.writeFeaturesObject(features)

      loadDataLayer(map, geoJsonFile, opts)
    } else if (layerData?._ol_kit_data_source) {
      // fetch the external
      loadDataLayer(map, layerData._ol_kit_data_source, opts)
    } else {
      ugh.error(`Layer (title: ${layerData.title}) failed to load from project file!`)
    }
  })
}
