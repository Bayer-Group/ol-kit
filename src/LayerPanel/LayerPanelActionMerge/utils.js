
import olFeature from 'ol/Feature'
import olLayerVector from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import ugh from 'ugh'

/**
 * Takes an array of vector features and creates a new layer
 * @category LayerPanel
 * @function
 * @since 1.13.0
 * @param {Object} map - Openlayers map object
 * @param {Object[]} [features] - An array of the features to be included in the new layer
 */
export function addNewLayer (map, features, opts) {
  const source = new VectorSource({ features })
  const layer = new olLayerVector({ source })

  map.addLayer(layer)
}