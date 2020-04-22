import React, { Component } from 'react'
import PropTypes from 'prop-types'
import LayerPanelPage from 'LayerPanel/LayerPanelPage'
import LayerPanelHeader from 'LayerPanel/LayerPanelHeader'
import LayerPanelContent from 'LayerPanel/LayerPanelContent'
import LayerPanelList from 'LayerPanel/LayerPanelList'

import TextField from '@material-ui/core/TextField'

import olObservable from 'ol/observable'
import olLayerVector from 'ol/layer/vector'
import olSourceVector from 'ol/source/vector'
import olStyleStyle from 'ol/style/style'

import VectorLayer from 'classes/VectorLayer'

import LayerPanelActionRemove from 'LayerPanel/LayerPanelActionRemove'
import LayerPanelActionImport from 'LayerPanel/LayerPanelActionImport'
import LayerPanelActionExport from 'LayerPanel/LayerPanelActionExport'

import isEqual from 'lodash.isequal'

const INDETERMINATE = 'indeterminate'

class LayerPanelListPage extends Component {
  constructor (props) {
    super(props)

    this.state = {
      layers: [],
      masterCheckboxVisibility: true,
      showReportLayerBugModal: false,
      currentLayer: {},
      featureListeners: [],
      filterText: null
    }
  }

  componentDidMount = () => {
    const { map, layerFilter } = this.props
    const layers = map.getLayers()
    const handleMapChange = (e) => {
      const filteredLayers = layerFilter(layers.getArray())
      const safeFilteredLayersLength = filteredLayers ? filteredLayers.length - 1 : 0

      filteredLayers[safeFilteredLayersLength] && filteredLayers[safeFilteredLayersLength].setZIndex(filteredLayers.length) // eslint-disable-line

      this.setState({ layers: filteredLayers }, this.bindFeatureListeners)
    }

    // we call this to re-retrieve the layers on mount
    handleMapChange()

    // we call this to re-adjust the master checkbox as needed
    this.handleMasterCheckbox()

    // bind the event listeners
    this.onAddKey = layers.on('add', handleMapChange)
    this.onRemoveKey = layers.on('remove', handleMapChange)
  }

  componentWillUnmount = () => {
    // unbind the listeners
    olObservable.unByKey(this.onAddKey)
    olObservable.unByKey(this.onRemoveKey)
    olObservable.unByKey(this.onMoveEndKey)
    this.removeFeatureListeners()
  }

  componentDidUpdate (prevProps, prevState) {
    // if there were previous layers but then removed to none set layers to empty and hanlde the mastercheckbox
    if (prevState.layers.length > 0 && this.state.layers.length === 0) {
      this.setState({ layers: [] })
      this.handleMasterCheckbox()
      // if you are adding layers when the prevlayers was 0 then the mastercheckbox needs to be dealt with
    } else if (prevState.layers.length === 0 && this.state.layers.length > 0) {
      this.handleMasterCheckbox()
    }
  }

  bindFeatureListeners = () => {
    const { layers = [] } = this.state
    const featureListeners = layers.reduce((listeners = [], layer) => {
      const isVectorLayer = this.isValidVectorLayer(layer)
      const canGetSource = typeof layer.getSource === 'function'
      const hasVectorSource = canGetSource && layer.getSource() instanceof olSourceVector

      if (!isVectorLayer && !hasVectorSource) return [...listeners]

      const source = layer.getSource()
      const addFeature = source.on('addfeature', this.handleFeatureChange)
      const removeFeature = source.on('removefeature', this.handleFeatureChange)

      return [...listeners, addFeature, removeFeature]
    }, [])

    this.setState({ featureListeners })
  }

  removeFeatureListeners = () => {
    const { featureListeners = [] } = this.state

    Array.isArray(featureListeners) && featureListeners.forEach(listener => {
      olObservable.unByKey(listener)
    })
  }

  handleFeatureChange = () => {
    this.forceUpdate()
  }

  getVisibleLayers = () => {
    return this.state.layers.filter(layer => layer.getVisible())
  }

  showLayers = (layers) => {
    return layers.map(layer => {
      layer.setVisible(true)

      return layer
    })
  }

  hideLayers = (layers) => {
    return layers.map(layer => {
      layer.setVisible(false)

      return layer
    })
  }

  setVisibilityForAllLayers = (visibility) => {
    const { layers } = this.state
    const updatedLayers = visibility ? this.showLayers(layers) : this.hideLayers(layers)

    layers.forEach(layer => this.setVisibilityForAllFeaturesOfLayer(layer, visibility))
    this.setState({ layers: updatedLayers })
  }

  getFeaturesForLayer = (layer) => {
    if (!this.isValidVectorLayer(layer)) return
    if (this.props.shouldHideFeatures(layer)) return

    return layer.getSource().getFeatures().map(feature => {
      const isVisible = feature.get('_feature_visibility') === undefined ? true : feature.get('_feature_visibility')
      const iaFeatureStyle = feature.get('_feature_style') || feature.getStyle()
      const featureOriginalStyle = isEqual(iaFeatureStyle, new olStyleStyle(null)) ? feature.setStyle(null) : iaFeatureStyle
      const featureStyle = isVisible ? featureOriginalStyle : new olStyleStyle()

      feature.set('_feature_visibility', isVisible)
      if (feature.get('_feature_style') === undefined) feature.set('_feature_style', featureStyle)
      feature.setStyle(featureStyle)

      return feature
    }).filter((feature) => {
      return !this.props.enableFilter || !this.state.filterText ? true : feature.get('name').toLowerCase().includes(this.state.filterText.toLowerCase())
    })
  }

  getVisibleFeaturesForLayer = (layer) => {
    return (this.isValidVectorLayer(layer))
      ? layer.getSource().getFeatures().filter(feature => feature.get('_feature_visibility')) : []
  }

  setVisibilityForAllFeaturesOfLayer = (layer, visibility) => {
    if (this.isValidVectorLayer(layer)) {
      layer.getSource().getFeatures().map(feature => {
        feature.set('_feature_visibility', visibility)
        feature.setStyle(feature.get('_feature_style'))
      })
    }
  }

  // layerpanel header bulk actions
  // handleRemove = () => {
  //   this.state.layers.forEach(layer => {
  //     if (this.props.shouldAllowLayerRemoval(layer)) {
  //       (layer.getVisible() && layer.getVisible() !== INDETERMINATE) && this.props.map.removeLayer(layer)
  //       this.isValidVectorLayer(layer) && this.removeFeaturesForLayer(layer)
  //     }
  //   })
  // }

  // remove the layer
  removeLayer = (layer) => {
    const { map } = this.props

    map.removeLayer(layer)
  }

  // remove visible features on the layer
  removeFeaturesForLayer = layer => {
    const removeFeatures = this.getVisibleFeaturesForLayer(layer)

    removeFeatures.map(feature => layer.getSource().removeFeature(feature))
    this.handleLayerCheckbox(layer)
  }

  // handleExport = (filetype) => {
  //   const { onExportFeatures } = this.props
  //   const exportableFeatures = this.collectExportableFeatures()

  //   onExportFeatures(filetype, exportableFeatures)
  // }

  // collectExportableFeatures = () => {
  //   const features = this.getVisibleLayers().filter(layer => this.isValidVectorLayer(layer)).map(layer => {
  //     return layer.getSource().getFeatures()
  //   })

  //   return features.flat()
  // }

  // isExportable = () => {
  //   const visibleLayers = this.getVisibleLayers()

  //   return visibleLayers.filter(layer => {
  //     return this.isValidVectorLayer(layer)
  //   }).length !== visibleLayers.length || visibleLayers.length === 0
  // }

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

  // this is where all of the checkbox magic happens...
  handleMasterCheckbox = () => {
    const visibleLayers = this.getVisibleLayers().length
    const allLayers = this.state.layers.length
    const indeterminateLayers = this.getVisibleLayers().filter(layer => layer.getVisible() === INDETERMINATE).length
    const masterCheckboxState = indeterminateLayers ? INDETERMINATE : visibleLayers === allLayers && allLayers > 0 ? true : visibleLayers > 0 ? INDETERMINATE : false // eslint-disable-line

    this.setState({ masterCheckboxVisibility: masterCheckboxState })
    this.forceUpdate()
  }

  handleLayerCheckbox = (layer, layerCheckboxClick = false) => {
    const visibleFeatures = this.getVisibleFeaturesForLayer(layer).length
    const totalFeatures = this.isValidVectorLayer(layer) ? layer.getSource().getFeatures().length : 0
    const layerVisibility = visibleFeatures === totalFeatures && totalFeatures > 0 ? true : visibleFeatures > 0 ? INDETERMINATE : false // eslint-disable-line

    if (layerCheckboxClick && layerVisibility === INDETERMINATE) {
      layer.setVisible(true)
    } else {
      layerCheckboxClick ? layer.setVisible(!layer.getVisible()) : layer.setVisible(layerVisibility)
    }

    if (layerCheckboxClick) this.setVisibilityForAllFeaturesOfLayer(layer, layer.getVisible())

    this.handleMasterCheckbox()
  }

  handleFeatureCheckbox = (layer, feature) => {
    feature.set('_feature_visibility', !feature.get('_feature_visibility'))
    this.handleLayerCheckbox(layer)
  }

  handleFilter = (filterText) => {
    this.setState({ filterText })
  }

  isValidVectorLayer = (layer) => {
    return (layer instanceof olLayerVector || layer.isVectorLayer)
  }

  render () {
    const { translations, layerFilter, handleFeatureDoubleClick, handleLayerDoubleClick,
      customActions, enableFilter, getMenuItemsForLayer, shouldAllowLayerRemoval, map, onFileImport } = this.props
    const { layers, masterCheckboxVisibility, filterText } = this.state
    const noVisibleLayers = this.getVisibleLayers().length === 0

    return (
      <LayerPanelPage>
        <LayerPanelHeader
          title={translations['geokit.LayerPanelListPage.title']}
          translations={translations}
          layers={layers}
          handleMasterCheckbox={this.handleMasterCheckbox}
          masterCheckboxVisibility={masterCheckboxVisibility}
          setVisibilityForAllLayers={this.setVisibilityForAllLayers}
          customActions={customActions}
          map={map}>
          <LayerPanelActionRemove />
          <LayerPanelActionImport handleImport={onFileImport} />
          <LayerPanelActionExport />
        </LayerPanelHeader>
        {enableFilter &&
          <TextField
            id='feature-filter-input'
            label={translations['geokit.LayerPanelListPage.filterText']}
            type='text'
            style={{ margin: '8px' }}
            fullWidth
            value={filterText}
            onChange={(e) => this.handleFilter(e.target.value)}
          />
        }
        <LayerPanelContent>
          <LayerPanelList
            translations={translations}
            layers={layerFilter(layers).filter((layer) => {
              const filteredFeatures = this.getFeaturesForLayer(layer)

              return !enableFilter || !(layer instanceof olLayerVector) ? true : filteredFeatures.length
            })}
            getMenuItemsForLayer={getMenuItemsForLayer}
            gotoLayerExtent={this.gotoLayerExtent}
            removeLayer={this.removeLayer}
            handleMasterCheckbox={this.handleMasterCheckbox}
            getFeaturesForLayer={this.getFeaturesForLayer}
            handleFeatureCheckbox={this.handleFeatureCheckbox}
            handleLayerCheckbox={this.handleLayerCheckbox}
            handleFeatureDoubleClick={handleFeatureDoubleClick}
            handleLayerDoubleClick={handleLayerDoubleClick}
            shouldAllowLayerRemoval={shouldAllowLayerRemoval}
            map={map} />
        </LayerPanelContent>
      </LayerPanelPage>
    )
  }
}

LayerPanelListPage.defaultProps = {
  handleFeatureDoubleClick: () => {},
  handleLayerDoubleClick: () => {},
  menuItems: [],
  layerFilter: (layers) => layers.filter(layer => !layer.get('_vmf_basemap') && layer.get('name') !== 'unselectable'),
  shouldHideFeatures: (layer) => false,
  shouldAllowLayerRemoval: (layer) => true,
  translations: {
    'geokit.LayerPanelListPage.title': 'Active Layers',
    'geokit.LayerPanelListPage.filterText': 'Filter Layers'
  }
}

LayerPanelListPage.propTypes = {
  /** Object with key/value pairs for translated strings */
  translations: PropTypes.object,

  /** An Openlayer map from which the layer panel will derive its layers  */
  map: PropTypes.object,

  /** The icon for the page shown in the left side of the layer panel */
  tabIcon: PropTypes.node,

  /** An array of menu items components to show for each layer (only applies to default pages) */
  menuItems: PropTypes.node,

  /** A function which takes in layers & returns a subset of those layers (useful to "hide" certain layers) */
  layerFilter: PropTypes.func,

  /** A boolean which turns on/off filtering of features in the layer panel page */
  enableFilter: PropTypes.bool,

  /** A callback function passed the features imported from 'kmz', 'kml', 'geojson', 'wkt', 'csv', 'zip', and 'json' file types */
  onFeaturesImport: PropTypes.func,

  /** A callback function fired when a feature list item is double clicked */
  handleFeatureDoubleClick: PropTypes.func,

  /** A callback function fired when a feature list header is double clicked */
  handleLayerDoubleClick: PropTypes.func,

  /** An array of components to be rendered in the LayerPanelHeader action menu */
  customActions: PropTypes.array,

  /** A callback function to determine if a given layer's features should be kept hidden from the panel page display */
  shouldHideFeatures: PropTypes.func,

  /** A callback function to determine if a given layer should be allowed to be removed from the panel page display */
  shouldAllowLayerRemoval: PropTypes.func,
  convertFileToFeatures: PropTypes.func,
  exportFeatures: PropTypes.func,
  getMenuItemsForLayer: PropTypes.func
}

export default LayerPanelListPage
