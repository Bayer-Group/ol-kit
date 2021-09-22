import React, { Component } from 'react'
import PropTypes from 'prop-types'
import MenuItem from '@material-ui/core/MenuItem'
import { connectToContext } from 'Provider'

/**
 * @component
 * @category LayerPanel
 * @since 1.14.1
 */
class LayerPanelActionDuplicate extends Component {
  duplicateLayer = (layer) => {
    const { map } = this.props; 
    map.addLayer(layer);
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
      <MenuItem data-testid='LayerPanelAction.duplicate' key={'zoom'} onClick={() => this.duplicateLayer(layer)}>
        {translations['_ol_kit.actions.DuplicateLayer']}
      </MenuItem>
    )
  }
}

LayerPanelActionDuplicate.propTypes = {
  /** An openlayers `ol.map` object */
  map: PropTypes.object,

  /** An openlayers `ol.layer` */
  layer: PropTypes.object,

  /** A callback function that closes the `LayerPanelMenu` */
  handleMenuClose: PropTypes.func,

  /** An object of translation key/value pairs */
  translations: PropTypes.object
}

LayerPanelActionDuplicate.defaultProps = {
  handleMenuClose: () => {}
}

export default connectToContext(LayerPanelActionDuplicate)
