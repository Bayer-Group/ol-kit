import Heatmap from 'ol/layer/Heatmap'

class HeatmapLayer extends Heatmap {
  constructor (opts) {
    super(opts)

    this.isHeatmapLayer = true

    return this
  }
}

export default HeatmapLayer
