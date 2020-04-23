import React, { Component } from 'react'
import PropTypes from 'prop-types'
import MenuItem from '@material-ui/core/MenuItem'
import olLayerVector from 'ol/layer/vector'

class LayerPanelActionRemove extends Component {
  // this param of layers is coming from the MenuItem onClick func
  handleRemove = () => {
    const { layers, layer, map, shouldAllowLayerRemoval, removeFeaturesForLayer, handleMenuClose } = this.props

    if (Array.isArray(layers)) {
      layers.forEach(layer => {
        if (shouldAllowLayerRemoval(layer)) {
          (layer.getVisible() && layer.getVisible() !== 'indeterminate') && map.removeLayer(layer)
          this.isValidVectorLayer(layer) && removeFeaturesForLayer(layer)
        }
      })
    } else if (layer) {
      map.removeLayer(layer)
    }

    handleMenuClose()
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
