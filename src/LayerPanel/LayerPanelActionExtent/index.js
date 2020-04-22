import React, { Component } from 'react'
import MenuItem from '@material-ui/core/MenuItem'

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
    }
  }

  render () {
    const { layer } = this.props

    return (
      <MenuItem key={'zoom'} onClick={() => this.gotoLayerExtent(layer)}>Zoom to Layer Extent</MenuItem>
    )
  }
}

export default LayerPanelActionExtent
