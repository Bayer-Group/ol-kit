import React, { Component } from 'react'
import { ActionsContainer } from './styled'
import IconButton from '@material-ui/core/IconButton'
import LayerPanelMenu from 'LayerPanel/LayerPanelMenu'

import PropTypes from 'prop-types'

/**
 * @component
 * @category vmc
 */
class LayerPanelActions extends Component {
  constructor () {
    super()
    this.state = {
      anchorEl: null
    }
  }

  handleMenuClick = ({ currentTarget }) => {
    this.setState({ anchorEl: currentTarget })
  }

  handleMenuClose = () => {
    this.setState({ anchorEl: null })
  }

  render () {
    const { icon, children, translations } = this.props
    const { anchorEl } = this.state

    return (
      <ActionsContainer>
        <IconButton aria-label='more' aria-haspopup='true' onClick={this.handleMenuClick}>
          {icon}
        </IconButton>
        <LayerPanelMenu
          {...this.props}
          translations={translations}
          anchorEl={anchorEl}
          open={!!anchorEl}
          handleMenuClose={this.handleMenuClose}>
          {React.Children.map(children, child => child)}
        </LayerPanelMenu>
      </ActionsContainer>
    )
  }
}

LayerPanelActions.propTypes = {
  /** Object with key/value pairs for translated strings */
  translations: PropTypes.object,

  /** Callback function passed either `kml` or `shp` when an export is performed */
  handleExport: PropTypes.func.isRequired,

  /** Callback function called when an import is performed & passed a File object */
  handleImport: PropTypes.func.isRequired,

  /** Array of file types and their corresponding extensions */
  fileTypes: PropTypes.arrayOf(PropTypes.exact({
    display: PropTypes.string,
    extension: PropTypes.string
  })).isRequired,

  /** A boolean to enable/disable the export button */
  isExportable: PropTypes.bool,

  /** A boolean which disables the remove button */
  noVisibleLayers: PropTypes.bool,

  /** Callback function called when the remove button is clicked */
  handleRemove: PropTypes.func,

  /** components to be displayed below the default MenuItems */
  children: PropTypes.node,

  /** a boolean which disables the default actions */
  showDefaultActions: PropTypes.bool
}

export default LayerPanelActions
