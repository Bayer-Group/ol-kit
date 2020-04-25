import React, { Component } from 'react'
import Menu from '@material-ui/core/Menu'

import PropTypes from 'prop-types'

/**
 * @component
 * @category vmc
 */
class LayerPanelMenu extends Component {
  render () {
    const { handleMenuClose, open, anchorEl, children, layer } = this.props

    const menuItemsWithProps = React.Children.map(children, item =>
      React.cloneElement(item, {
        // we don't wont to spread props.children we overwrite it with the items children
        ...this.props,
        children: item.props.children,
        onClick: () => {
          handleMenuClose()
          item.props.onClick(layer)
        }
      })
    )

    return (
      <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
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

  /** dom node that is the target of the LayerPanelMenu */
  anchorEl: PropTypes.object,

  /** An array of nodes i.e. @material-ui-core/MenuItem */
  children: PropTypes.array,

  /** An openlayers `ol.layer` */
  layer: PropTypes.object
}

export default LayerPanelMenu
