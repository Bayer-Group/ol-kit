import React, { Component } from 'react'
import PropTypes from 'prop-types'
import MenuItem from '@material-ui/core/MenuItem'
import olLayerVector from 'ol/layer/Vector'
import { connectToContext } from 'Provider'
import { addHeatmapLayer } from './utils'

/**
 * @component
 * @category LayerPanel
 * @since 1.13.0
 */
class LayerPanelActionHeatmap extends Component {
  handleCreateHeatmap = () => {
    const { map, layer, onCreateHeatmap } = this.props
    const { handleMenuClose } = this.props
    const heatmapLayer = addHeatmapLayer(map, layer)

    onCreateHeatmap(heatmapLayer)
    handleMenuClose()
  }

  hasVisibleVectorLayers = () => {
    const visibleLayers = this.getVisibleLayers()

    return visibleLayers.filter(layer => {
      return this.isValidVectorLayer(layer)
    }).length > 1 // at least two layers required for a merge
  }

  isValidVectorLayer = (layer) => {
    return (layer instanceof olLayerVector || (layer && layer.isVectorLayer))
  }

  render () {
    const { layer, translations } = this.props

    return (
      <MenuItem
        key='heatmap'
        data-testid='LayerPanel.heatmap'
        disableGutters={false}
        disabled={!this.isValidVectorLayer(layer)}
        onClick={this.handleCreateHeatmap} >
        {translations['_ol_kit.LayerPanelActions.heatmap']}
      </MenuItem>
    )
  }
}

LayerPanelActionHeatmap.propTypes = {
  /** A function that closes the LayerPanelMenu */
  handleMenuClose: PropTypes.func,

  /** A Vector Layer */
  layer: PropTypes.array.isRequired,

  /** Openlayers map */
  map: PropTypes.object.isRequired,

  /** Callback fired after merge, called with new layer as argument */
  onCreateHeatmap: PropTypes.func,

  /** An object of translation key/value pairs */
  translations: PropTypes.object.isRequired
}

LayerPanelActionHeatmap.defaultProps = {
  handleMenuClose: () => {},
  onCreateHeatmap: () => {}
}

export default connectToContext(LayerPanelActionHeatmap)
