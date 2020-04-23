import React, { Component } from 'react'
import MenuItem from '@material-ui/core/MenuItem'

class LayerPanelActionExport extends Component {
  handleExport = (filetype) => {
    const { onExportFeatures, handleMenuClose } = this.props
    const exportableFeatures = this.collectExportableFeatures()

    onExportFeatures && onExportFeatures(filetype, exportableFeatures)
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

  getVisibleLayers = () => {
    return this.props.layers.filter(layer => layer.getVisible())
  }

  render () {
    const { translations } = this.props

    return (
      [<MenuItem
        key='exportKml'
        disbaleGutter={false}
        disabled={this.isExportable}
        onClick={() => this.handleExport('kml')} >
        {translations['olKit.LayerPanelActions.kml'] || 'Export KML'}
      </MenuItem>,
      <MenuItem
        key='exportShp'
        disbaleGutter={false}
        disabled={this.isExportable}
        onClick={() => this.handleExport('shp')} >
        {translations['olKit.LayerPanelActions.shapefile'] || 'Export Shapefile'}
      </MenuItem>]
    )
  }
}

export default LayerPanelActionExport
