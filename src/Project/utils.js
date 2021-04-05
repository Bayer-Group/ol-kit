import Map from 'ol/Map'
import LayerVector from 'ol/layer/Vector'
import olFormatGeoJSON from 'ol/format/GeoJSON'
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
    // some key/values are too large to store in the project file metadata
    const keysBlacklist = ['source']
    const keys = layer.getKeys().filter(key => !keysBlacklist.includes(key))
    const values = {}

    keys.forEach(key => {
      values[key] = layer.get(key)
    })
    const isVectorLayer = layer instanceof LayerVector || layer.isVectorLayer
    const isBasemap = !!layer.get('_ol_kit_basemap')

    if (isVectorLayer && !layer.get('_ol_kit_data_source')) {
      // this is a vector layer that was created within ol-kit...get the feature geometries
      const features = layer.getSource().getFeatures()
      const geoJson = new olFormatGeoJSON().writeFeatures(features)

      values['_ol_kit_project_geojson'] = geoJson
    }

    return values
  })
  const outputFile = {
    version,
    layers
  }

  return outputFile
}
