import HeatmapLayer from 'ol/layer/Heatmap'
import Layer from 'ol/layer/Layer'
import olSourceVector from 'ol/source/Vector'

/**
 * Takes a vector layer and returns a heatmap layer
 * @category LayerPanel
 * @function
 * @since 1.13.0
 * @param {Object} map - Openlayers map object
 * @param {Layer} layer - A vector layer that will be used to create heatmap layer
 * @returns {HeatmapLayer} HeatmapLayer
 */
 export function addHeatmapLayer (map, layer, opts = {}) {
  if (!(map instanceof olMap)) return ugh.error('addHeatmapLayer requires a valid openlayers map as arg')
  
  // set defaults that will be read by HeatmapControls component
  const {
    blur = 30,
    radius = 2
  } = opts
  const title = opts?.title || `Heatmap from ${layer.get('title') || 'vector'}`
  const features = layer.getSource().getFeatures()
  // create a heatmap layer and add to the map
  const heatmapLayer = new HeatmapLayer({
    title,
    source: new olSourceVector({
      features
    }),
    blur: parseInt(blur, 10),
    radius: parseInt(radius, 10)
  })

  map.addLayer(heatmapLayer)

  return heatmapLayer
}