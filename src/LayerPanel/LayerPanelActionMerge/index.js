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
    const { map, onMergeLayers } = this.props
    const { handleMenuClose } = this.props
    const { features, title } = this.collectVectorFeatures()
    const opts = { title }
    const layer = addVectorLayer(map, features, opts)

    onMergeLayers(layer)
    handleMenuClose()
  }

  collectVectorFeatures = () => {
    let title = 'Merged: '
    const originalFeatures = this.getVisibleLayers().filter(layer => this.isValidVectorLayer(layer)).map((layer, i) => {
      const multi = i === 0 ? '' : ', '
      const thisTitle = multi + layer.get('title')
      
      // add layer title to full string
      title += thisTitle

      return layer.getSource().getFeatures()
    })

    // clone important so new features are not connected to original
    const features = originalFeatures.flat().map(feature => {
      const cloned = feature.clone()

      cloned.setStyle(feature.getStyle())

      return cloned
    })

    return { features, title }
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
        disabled={!this.hasVisibleVectorLayers()}
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

  /** Callback fired after merge, called with new layer as argument */
  onMergeLayers: PropTypes.func,

  /** An object of translation key/value pairs */
  translations: PropTypes.object.isRequired
}

LayerPanelActionMerge.defaultProps = {
  handleMenuClose: () => {},
  onMergeLayers: () => {}
}

export default connectToContext(LayerPanelActionMerge)
