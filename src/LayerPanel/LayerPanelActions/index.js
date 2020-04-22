import React, { Component } from 'react'
import { ActionsContainer, UploadInput } from './styled'
import IconButton from '@material-ui/core/IconButton'

import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'

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

  exportShapefile = () => {
    this.props.handleExport('shp')
    this.handleMenuClose()
  }

  exportKmlFile = () => {
    this.props.handleExport('kml')
    this.handleMenuClose()
  }

  onFileChange = (id) => {
    const file = document.getElementById(id).files[0]

    if (this.validFile(file)) {
      this.props.handleImport(file)
      this.handleMenuClose()
    }

    // clear the file input -- otherwise file with same name as last imported will not trigger event
    this.setState({ value: null })
  }

  validFile = (file) => {
    const { fileTypes } = this.props

    return file && fileTypes.find((type) => file.name.endsWith(type.extension.toLowerCase()))
  }

  render () {
    const { translations, fileTypes, isExportable, noVisibleLayers, showDefaultActions } = this.props
    const { anchorEl } = this.state

    return (
      <ActionsContainer>
        <IconButton aria-label='more' aria-haspopup='true' onClick={this.handleMenuClick}>
          <MoreHorizIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={this.handleMenuClose}>
          {this.props.children}
        </Menu>
      </ActionsContainer>
    )
  }
}

LayerPanelActions.defaultProps = {
  fileTypes: [
    {
      display: 'KML',
      extension: '.kml'
    },
    {
      display: 'Compressed KML',
      extension: '.kmz'
    },
    {
      display: 'GeoJSON',
      extension: '.geojson'
    },
    {
      display: 'JSON',
      extension: '.json'
    },
    {
      display: 'WKT',
      extension: '.wkt'
    },
    {
      display: 'CSV',
      extension: '.csv'
    },
    {
      display: 'Shapefile ZIP',
      extension: '.zip'
    }
  ],
  translations: {
    'olKit.LayerPanelActions.remove': 'Remove',
    'olKit.LayerPanelActions.import': 'Import',
    'olKit.LayerPanelActions.kml': 'Export as KML',
    'olKit.LayerPanelActions.shapefile': 'Export as Shapefile'
  },
  children: [],
  showDefaultActions: true
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
