import Heatmap from 'ol/layer/Heatmap'

/**
 * HeatmapLayer class extends olLayerHeatmap {@link https://openlayers.org/en/latest/apidoc/module-ol_layer_Heatmap-Heatmap.html}
 * @function
 * @category Classes
 * @since 1.6.0
 * @param {Object} [opts] - Object of optional params for olLayerHeatmap
 */
class HeatmapLayer extends Heatmap {
  constructor (opts) {
    super(opts)

    this.isHeatmapLayer = true

    return this
  }
}

export default HeatmapLayer
