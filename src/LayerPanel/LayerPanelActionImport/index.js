import React, { Component } from 'react'
import PropTypes from 'prop-types'
import MenuItem from '@material-ui/core/MenuItem'
import { UploadInput } from './styled'
import { connectToMap } from 'Map'

/**
 * @component
 * @category LayerPanel
 * @since 0.5.0
 */
class LayerPanelActionImport extends Component {
  constructor (props) {
    super(props)

    this.state = { value: null }
  }

  onFileChange = (id) => {
    const file = document.getElementById(id).files[0]

    if (this.validFile(file)) {
      this.props.handleImport(file)
    }

    // clear the file input -- otherwise file with same name as last imported will not trigger event
    this.setState({ value: null })
    this.props.handleMenuClose()
  }

  validFile = (file) => {
    const { fileTypes } = this.props

    return file && fileTypes.find((type) => file.name.endsWith(type.extension.toLowerCase()))
  }

  render () {
    const { fileTypes, translations } = this.props

    return (
      <MenuItem disableGutters={false}>
        <label htmlFor='file-upload'>
          {translations['_ol_kit.LayerPanelActions.import']}
        </label>
        <UploadInput
          value={this.state.value || ''}
          type='file'
          accept={fileTypes.map(f => f.extension).join(',')}
          id='file-upload'
          hidden={true}
          onChange={(e) => this.onFileChange('file-upload')}
          className='zmdi zmdi-upload'
        />
      </MenuItem>
    )
  }
}

LayerPanelActionImport.propTypes = {
  /** Array of file types and their corresponding extensions */
  fileTypes: PropTypes.arrayOf(PropTypes.exact({
    display: PropTypes.string,
    extension: PropTypes.string
  })).isRequired,

  /** A callback function that returns the file thats being imported */
  handleImport: PropTypes.func.isRequired,

  /** A function that closes the `LayerPanelMenu` */
  handleMenuClose: PropTypes.func,

  /** An object of translation key/value pairs */
  translations: PropTypes.object
}

LayerPanelActionImport.defaultProps = {
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
  handleMenuClose: () => {},
  handleImport: () => {}
}

export default connectToMap(LayerPanelActionImport)
