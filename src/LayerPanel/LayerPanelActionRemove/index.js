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
    const { layers, layer, translations } = this.props
    const noVisibleLayers = layers && this.getVisibleLayers().length === 0
    const removeLayer = translations['_ol_kit.actions.removeLayer'] || 'Remove Layer'
    const removeLayers = translations['_ol_kit.actions.removeLayers'] || 'Remove Layers'

    return (
      <MenuItem disbaleGutter={false} disabled={layers && noVisibleLayers} onClick={this.handleRemove}>
        {layer ? removeLayer : removeLayers}
      </MenuItem>
    )
  }
}

LayerPanelActionRemove.propTypes = {
  /** An array of openlayers `ol.layers` */
  layers: PropTypes.array,

  /** An openlayers `ol.layer` object */
  layer: PropTypes.object,

  /** An openlayers `ol.map` object */
  map: PropTypes.object,

  /** An object of translation key/value pairs */
  translations: PropTypes.object,

  /** A callback function that returns openlayers `ol.layer` to check if the `ol.layer` can/should be removed from map */
  shouldAllowLayerRemoval: PropTypes.func,

  /** A callback function that returns openlayers `ol.layer` for removing `ol.features` */
  removeFeaturesForLayer: PropTypes.func,

  /** A callback function that closes the `LayerPanelMenu` */
  handleMenuClose: PropTypes.func
}

LayerPanelActionRemove.defaultProps = {
  shouldAllowLayerRemoval: (layer) => true,
  handleMenuClose: () => {}
}

export default LayerPanelActionRemove
