import React, { Component } from 'react'
import Menu from '@material-ui/core/Menu'

import PropTypes from 'prop-types'

/**
 * @component
 * @category vmc
 */
class LayerPanelMenu extends Component {
  render () {
    const { handleMenuClose, layer, layers, open, anchorEl, materialId, children } = this.props

    console.log(layer, layers)

    const menuItemsWithProps = React.Children.map(children, item =>
      React.cloneElement(item, {
        ...this.props,
        onClick: () => {
          const layerCollection = layer || layers

          handleMenuClose()
          item.props.onClick(layerCollection)
        }
      })
    )

    return (
      <Menu id={materialId} anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
        {menuItemsWithProps}
      </Menu>
    )
  }
}

LayerPanelMenu.propTypes = {
  /** A callback for handling a menuClose */
  handleMenuClose: PropTypes.func,

  /** A boolean that will show/hide the list item's menu */
  open: PropTypes.bool,

  /** FIXME */
  anchorEl: PropTypes.object,
  materialId: PropTypes.string,

  /** An array of @material-ui-core/MenuItem */
  menuItems: PropTypes.array,

  /** Openlayer layer object */
  layer: PropTypes.object,

  /** Callback function called when the 'go to layer extent' menu option is clicked */
  gotoLayerExtent: PropTypes.func,
  map: PropTypes.object,
  shouldAllowLayerRemoval: PropTypes.func
}

export default LayerPanelMenu
