import React, { Component } from 'react'
import PropTypes from 'prop-types'
import MenuItem from '@material-ui/core/MenuItem'
import olLayerVector from 'ol/layer/vector'

class LayerPanelActionRemove extends Component {
  // this param of layers is coming from the MenuItem onClick func
  handleRemove = () => {
    const { layers, layer } = this.props

    if (Array.isArray(layers)) {
      this.props.layers.forEach(layer => {
        if (this.props.shouldAllowLayerRemoval(layer)) {
          (layer.getVisible() && layer.getVisible() !== 'indeterminate') && this.props.map.removeLayer(layer)
          this.isValidVectorLayer(layer) && this.removeFeaturesForLayer(layer)
        }
      })
    } else if (layer) {
      this.props.map.removeLayer(layer)
    }
  }

  isValidVectorLayer = (layer) => {
    return (layer instanceof olLayerVector || layer.isVectorLayer)
  }

  getVisibleLayers = () => {
    return this.props.layers.filter(layer => layer.getVisible())
  }

  render () {
    const { translations, layers, layer } = this.props
    const noVisibleLayers = layers && this.getVisibleLayers().length === 0

    console.log('layers from props', layers, layer)

    return (
      <MenuItem disbaleGutter={false} disabled={layers && noVisibleLayers} onClick={this.handleRemove}>
        {layer ? 'Remove Layer' : 'Remove Layers'}
      </MenuItem>
    )
  }
}

LayerPanelActionRemove.propTypes = {
  layers: PropTypes.array,
  layer: PropTypes.object,
  map: PropTypes.object,
  translations: PropTypes.object,
  shouldAllowLayerRemoval: PropTypes.func
}

LayerPanelActionRemove.defaultProps = {
  shouldAllowLayerRemoval: (layer) => true
}

export default LayerPanelActionRemove
