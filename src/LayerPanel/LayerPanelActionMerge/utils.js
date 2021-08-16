import olMap from 'ol/Map'
import VectorSource from 'ol/source/Vector'
import { VectorLayer } from 'classes'
import ugh from 'ugh'

let mergedIndex = 1

/**
 * Takes an array of vector features and creates a new layer
 * @category LayerPanel
 * @function
 * @since 1.13.0
 * @param {Object} map - Openlayers map object
 * @param {Object[]} [features] - An array of the features to be included in the new layer
 * @returns {Layer} VectorLayer
 */
export function addVectorLayer (map, features = [], opts = {}) {
  if (!(map instanceof olMap)) return ugh.error('addVectorLayer requires a valid openlayers map as arg')
  if (!Array.isArray(features)) return ugh.error('addVectorLayer second arg must be an array of features')

  const title = opts?.title || `Merged Layer (${mergedIndex})`
  const source = new VectorSource({ features })
  const layer = new VectorLayer({
    source,
    title,
    // _ol_kit_layerpanel_visibility: true
  })
  mergedIndex++

  console.log('CLONED features', features)

  // layer.setVisible(true)

  map.addLayer(layer)

  return layer
}