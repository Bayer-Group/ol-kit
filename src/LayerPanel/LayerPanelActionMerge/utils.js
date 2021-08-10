import olMap from 'ol/Map'
import VectorSource from 'ol/source/Vector'
import { VectorLayer } from 'classes'
import ugh from 'ugh'

/**
 * Takes an array of vector features and creates a new layer
 * @category LayerPanel
 * @function
 * @since 1.13.0
 * @param {Object} map - Openlayers map object
 * @param {Object[]} [features] - An array of the features to be included in the new layer
 * @returns {Layer} VectorLayer
 */
export function addVectorLayer (map, features = [], opts) {
  if (!(map instanceof olMap)) return ugh.error('addVectorLayer requires a valid openlayers map as arg')
  if (!Array.isArray(features)) return ugh.error('addVectorLayer second arg must be an array of features')

  const source = new VectorSource({ features })
  const layer = new VectorLayer({ source })

  map.addLayer(layer)

  return layer
}