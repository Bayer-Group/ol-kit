import React, { Component } from 'react'
import PropTypes from 'prop-types'
import MenuItem from '@material-ui/core/MenuItem'
import olLayerVector from 'ol/layer/vector'
import { connectToMap } from 'Map'
import { exportFeatures } from './utils'

/**
 * @component
 * @category LayerPanel
 * @since 0.5.0
 */
class LayerPanelActionExport extends Component {
  handleExport = (filetype) => {
    const { onExportFeatures, handleMenuClose } = this.props
    const exportableFeatures = this.collectExportableFeatures()

    onExportFeatures(filetype, exportableFeatures)
    handleMenuClose()
  }

  collectExportableFeatures = () => {
    const features = this.getVisibleLayers().filter(layer => this.isValidVectorLayer(layer)).map(layer => {
      return layer.getSource().getFeatures()
    })

    return features.flat()
  }

  isExportable = () => {
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
      [<MenuItem
        key='exportKml'
        data-testid='LayerPanel.exportKML'
        disableGutters={false}
        disabled={this.isExportable()}
        onClick={() => this.handleExport('kml')} >
        {translations['_ol_kit.LayerPanelActions.kml'] || 'Export KML'}
      </MenuItem>,
      <MenuItem
        key='exportShp'
        data-testid='LayerPanel.exportShapefile'
        disableGutters={false}
        disabled={this.isExportable()}
        onClick={() => this.handleExport('shp')} >
        {translations['_ol_kit.LayerPanelActions.shapefile'] || 'Export Shapefile'}
      </MenuItem>,
      <MenuItem
      key='exportGeoJSON'
      data-testid='LayerPanel.exportGeoJSON'
      disableGutters={false}
      disabled={this.isExportable()}
      onClick={() => this.handleExport('geojson')} >
      {translations['_ol_kit.LayerPanelActions.geojson'] || 'Export GeoJSON'}
    </MenuItem>]
    )
  }
}

LayerPanelActionExport.propTypes = {
  /** A callback function that returns the file type and the features that are being exported */
  onExportFeatures: PropTypes.func,

  /** A function that closes the LayerPanelMenu */
  handleMenuClose: PropTypes.func,

  /** An array of openlayers layers */
  layers: PropTypes.array,

  /** An object of translation key/value pairs */
  translations: PropTypes.object
}

LayerPanelActionExport.defaultProps = {
  onExportFeatures: () => {},
  handleMenuClose: () => {},
  onExportFeatures: exportFeatures
}

export default connectToMap(LayerPanelActionExport)
