import React, { Component } from 'react'
import PropTypes from 'prop-types'
import MenuItem from '@material-ui/core/MenuItem'
import olLayerVector from 'ol/layer/Vector'
import { connectToContext } from 'Provider'
import { addVectorLayer } from './utils'

/**
 * @component
 * @category LayerPanel
 * @since 1.13.0
 */
class LayerPanelActionMerge extends Component {
  handleMerge = () => {
    const { map } = this.props
    const { onExportFeatures, handleMenuClose } = this.props
    const allVectorFeatures = this.collectVectorFeatures()
    
    addVectorLayer(map, allVectorFeatures)
    handleMenuClose()
  }

  collectVectorFeatures = () => {
    const features = this.getVisibleLayers().filter(layer => this.isValidVectorLayer(layer)).map(layer => {
      return layer.getSource().getFeatures()
    })

    return features.flat()
  }

  hasVisibleVectorLayers = () => {
    const visibleLayers = this.getVisibleLayers()

    return visibleLayers.filter(layer => {
      return this.isValidVectorLayer(layer)
    }).length !== visibleLayers.length || visibleLayers.length === 0
  }

  isValidVectorLayer = (layer) => {
    return (layer instanceof olLayerVector || (layer && layer.isVectorLayer))
  }

  getVisibleLayers = () => {
    return this.props.layers.filter(layer => layer.getVisible())
  }

  render () {
    const { translations } = this.props

    return (
      <MenuItem
        key='merge'
        data-testid='LayerPanel.merge'
        disableGutters={false}
        disabled={this.hasVisibleVectorLayers()}
        onClick={this.handleMerge} >
        {translations['_ol_kit.LayerPanelActions.merge']}
      </MenuItem>
    )
  }
}

LayerPanelActionMerge.propTypes = {
  /** A function that closes the LayerPanelMenu */
  handleMenuClose: PropTypes.func,

  /** An array of openlayers layers */
  layers: PropTypes.array.isRequired,

  /** Openlayers map */
  map: PropTypes.object.isRequired,

  /** An object of translation key/value pairs */
  translations: PropTypes.object.isRequired
}

LayerPanelActionMerge.defaultProps = {
  handleMenuClose: () => {}
}

export default connectToContext(LayerPanelActionMerge)
