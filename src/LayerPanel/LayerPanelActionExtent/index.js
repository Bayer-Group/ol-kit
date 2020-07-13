import React, { Component } from 'react'
import PropTypes from 'prop-types'
import MenuItem from '@material-ui/core/MenuItem'
import { connectToMap } from 'Map'

/**
 * @component
 * @category LayerPanel
 * @since 0.5.0
 */
class LayerPanelActionExtent extends Component {
  getLayerExtentProps = (layer) => {
    const extent = (layer => {
      if (layer.isCatalogLayer) return layer.getSource().getProperties().extent
      if (layer.isGeoserverLayer) return layer.getWMSLayer().getSource().getExtent()

      return layer.getSource().getExtent && layer.getSource().getExtent()
    })(layer)

    return {
      // Find the extent of the clicked layer -- if a source has no getExtent function, see if it's in its properties
      extent,
      // Calculate left padding based on the sidebar being open/closed
      opts: { padding: [0, 0, 0, 320] }
    }
  }

  gotoLayerExtent = (layer) => {
    const { extent, opts } = this.getLayerExtentProps(layer)

    if (extent) {
      this.props.map.get('view').fit(extent, opts)
      this.props.handleMenuClose()
    }
  }

  render () {
    const { layer, translations } = this.props

    return (
      <MenuItem data-testid='LayerPanelAction.extent' key={'zoom'} onClick={() => this.gotoLayerExtent(layer)}>
        {translations['_ol_kit.actions.zoomToExtent'] || 'Zoom to Layer Extent'}
      </MenuItem>
    )
  }
}

LayerPanelActionExtent.propTypes = {
  /** An openlayers `ol.map` object */
  map: PropTypes.object,

  /** An openlayers `ol.layer` */
  layer: PropTypes.object,

  /** A callback function that closes the `LayerPanelMenu` */
  handleMenuClose: PropTypes.func,

  /** An object of translation key/value pairs */
  translations: PropTypes.object
}

LayerPanelActionExtent.defaultProps = {
  handleMenuClose: () => {}
}

export default connectToMap(LayerPanelActionExtent)
