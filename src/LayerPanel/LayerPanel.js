import React, { Component } from 'react'
import PropTypes from 'prop-types'
import LayerPanelBase from 'LayerPanel/LayerPanelBase'
import LayerPanelListPage from 'LayerPanel/LayerPanelListPage'
import { connectToMap } from 'Map'

import LayersIcon from '@material-ui/icons/Layers'

class LayerPanel extends Component {
  componentDidMount () {
    const { maps } = this.props

    maps.forEach(m => m.on(['visible', 'hidden'], () => this.forceUpdate()))
  }

  render () {
    const {
      translations,
      children,
      map,
      maps,
      layerFilter,
      onFeaturesImport,
      menuItems,
      enableFilter,
      customActions,
      handleFeatureDoubleClick,
      shouldHideFeatures,
      shouldAllowLayerRemoval,
      handleLayerDoubleClick,
      getMenuItemsForLayer
    } = this.props
    const olMaps = maps.length ? maps : [map] // this ensures backward compatibility so a single map will still work
    const returnFirstMap = (index) => index === 0
    const visibleMaps = olMaps.filter((m, i) =>
      m.getVisibleState instanceof Function ? m.getVisibleState() : returnFirstMap(i))

    // the filter ensures that older versions of vmf without this function will still work
    const mapsComps = visibleMaps.map((map, i) => {
      return <LayerPanelListPage
        key={i}
        translations={translations}
        tabIcon={visibleMaps.length < 2 ? <LayersIcon /> : i + 1}
        map={map}
        layerFilter={layerFilter}
        onFeaturesImport={onFeaturesImport}
        menuItems={menuItems}
        enableFilter={enableFilter}
        customActions={customActions}
        handleFeatureDoubleClick={handleFeatureDoubleClick}
        shouldHideFeatures={shouldHideFeatures}
        shouldAllowLayerRemoval={shouldAllowLayerRemoval}
        handleLayerDoubleClick={handleLayerDoubleClick}
        getMenuItemsForLayer={getMenuItemsForLayer} />
    })

    return (
      <LayerPanelBase translations={translations}>
        {mapsComps.concat(children)}
      </LayerPanelBase>
    )
  }
}

LayerPanel.propTypes = {
  /** Object with key/value pairs for translated strings */
  translations: PropTypes.object,

  /** An array of Openlayer map objects from which the layer panel will derive its layers  */
  maps: PropTypes.array,

  /**
   * An Openlayers map object from which the layer panel will derive its layers
   * @deprecated Use `maps` instead
   */
  map: PropTypes.object,

  /** A set of prebuilt page components (like `LayerPanelListPage` & `LayerPanelLegendPage`) or custom pages */
  children: PropTypes.node,

  /** An array of menu items to show for each layer (only applies to default pages) */
  menuItems: PropTypes.node,

  /** A function which takes in layers & returns a subset of those layers (useful to "hide" certain layers) */
  layerFilter: PropTypes.func,

  /** A callback function when the "manage layer" action of a layer is selected (with the layer passed in) */
  onManageLayer: PropTypes.func,

  /** A callback function passed the features imported from 'kmz', 'kml', 'geojson', 'wkt', 'csv', 'zip', and 'json' file types */
  onFeaturesImport: PropTypes.func,

  /** A callback function when the "report layer bug" action of a layer is selected (with the layer passed in) */
  onReportLayerBug: PropTypes.func,

  /** A boolean which turns on/off filtering of features in the layer panel page */
  enableFilter: PropTypes.bool,

  /** A callback function fired when a feature list item is double clicked */
  handleFeatureDoubleClick: PropTypes.func,

  /** A callback function fired when a layer list header is double clicked */
  handleLayerDoubleClick: PropTypes.func,

  /** An array of components to be rendered in the LayerPanelHeader action menu */
  customActions: PropTypes.array,

  /** A callback function to determine if a given layer's features should be kept hidden from the panel page display */
  shouldHideFeatures: PropTypes.func,

  /** A callback function to determine if a given layer should be allowed to be removed from the panel page display */
  shouldAllowLayerRemoval: PropTypes.func
}

LayerPanel.defaultProps = {
  maps: [],
  enableFilter: false
}

export default connectToMap(LayerPanel)
