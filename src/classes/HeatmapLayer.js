import { Heatmap } from 'ol/layer'

class HeatmapLayer extends Heatmap {
  constructor (opts) {
    super(opts)
    
    this.isHeatmapLayer = true

    return this
  }
}

export default HeatmapLayer