import React, { Component } from 'react'
import PropTypes from 'prop-types'
import LayerPanelPage from 'LayerPanel/LayerPanelPage'
import LayerPanelHeader from 'LayerPanel/LayerPanelHeader'
import LayerPanelContent from 'LayerPanel/LayerPanelContent'
import LayerPanelList from 'LayerPanel/LayerPanelList'
import LayerPanelListItem from 'LayerPanel/LayerPanelListItem'
import LayerPanelCheckbox from 'LayerPanel/LayerPanelCheckbox'
import LayerPanelExpandableList from 'LayerPanel/LayerPanelExpandableList'
import LayerPanelActions from 'LayerPanel/LayerPanelActions'
import { ListItem, ListItemText } from 'LayerPanel/LayerPanelListItem/styled'
import List from '@material-ui/core/List'
import Collapse from '@material-ui/core/Collapse'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import LayersIcon from '@material-ui/icons/Layers'

import MoreHorizIcon from '@material-ui/icons/MoreHoriz'

import LayerPanelActionOpacity from 'LayerPanel/LayerPanelActionOpacity'
import LayerPanelActionRemove from 'LayerPanel/LayerPanelActionRemove'
import LayerPanelActionExtent from 'LayerPanel/LayerPanelActionExtent'

import TextField from '@material-ui/core/TextField'

import olObservable from 'ol/observable'
import olLayerVector from 'ol/layer/vector'
import olSourceVector from 'ol/source/vector'
import olStyleStyle from 'ol/style/style'

import LayerPanelActionImport from 'LayerPanel/LayerPanelActionImport'
import LayerPanelActionExport from 'LayerPanel/LayerPanelActionExport'

import isEqual from 'lodash.isequal'

const INDETERMINATE = 'indeterminate'

class LayerPanelLayersPage extends Component {
  constructor (props) {
    super(props)

    this.state = {
      layers: [],
      masterCheckboxVisibility: true,
      showReportLayerBugModal: false,
      currentLayer: {},
      featureListeners: [],
      filterText: null,
      expandedLayer: false
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

  setVisibilityForAllLayers = (_, visibility) => {
    const { layers } = this.state
    const updatedLayers = visibility ? this.showLayers(layers) : this.hideLayers(layers)

    layers.forEach(layer => this.setVisibilityForAllFeaturesOfLayer(layer, visibility))
    this.setState({ layers: updatedLayers }, () => this.handleMasterCheckbox())
  }

  getFeaturesForLayer = (layer) => {
    if (!this.isValidVectorLayer(layer)) return
    if (this.props.shouldHideFeatures(layer)) return

    return layer.getSource().getFeatures().map(feature => {
      const isVisible = feature.get('_feature_visibility') === undefined ? true : feature.get('_feature_visibility')
      const iaFeatureStyle = feature.get('_feature_style') || feature.getStyle()
      const featureOriginalStyle = isEqual(iaFeatureStyle, new olStyleStyle(null))
        ? feature.setStyle(null) : iaFeatureStyle
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

  // remove visible features on the layer
  removeFeaturesForLayer = layer => {
    const removeFeatures = this.getVisibleFeaturesForLayer(layer)

    removeFeatures.map(feature => layer.getSource().removeFeature(feature))
    this.handleLayerCheckbox(layer)
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

  handleVisibility = (event, layer) => {
    event.stopPropagation()

    this.handleMasterCheckbox()
    this.handleLayerCheckbox(layer, true)
  }

  handleFilter = (filterText) => {
    this.setState({ filterText })
  }

  isValidVectorLayer = (layer) => {
    return (layer instanceof olLayerVector || (layer && layer.isVectorLayer))
  }

  handleExpandedLayer = () => {
    this.setState(({ expandedLayer: !this.state.expandedLayer }))
  }

  // highest zIndex should be at the front of the list (reverse order of array index)
  zIndexSort = (a, b) => b.getZIndex() - a.getZIndex()

  reorderLayers = (reorderedLayers) => {
    // apply the z-index changes down to all layers
    reorderedLayers.map((l, i) => l.setZIndex(reorderedLayers.length - i))

    this.forceUpdate()
  }

  render () {
    const {
      translations, layerFilter, handleFeatureDoubleClick, handleLayerDoubleClick, disableDrag,
      customActions, enableFilter, getMenuItemsForLayer, shouldAllowLayerRemoval, map, onFileImport, onExportFeatures
    } = this.props
    const { layers, masterCheckboxVisibility, filterText, expandedLayer } = this.state

    return (
      <LayerPanelPage>
        <LayerPanelHeader
          title={translations['olKit.LayerPanelLayersPage.title']}
          translations={translations}
          avatar={<LayerPanelCheckbox
            checkboxState={masterCheckboxVisibility} handleClick={this.setVisibilityForAllLayers} />}
          actions={customActions ||
            <LayerPanelActions
              icon={<MoreHorizIcon />}
              translations={translations}
              layers={layers}
              map={map}>
              <LayerPanelActionRemove
                removeFeaturesForLayer={this.removeFeaturesForLayer}
                shouldAllowLayerRemoval={shouldAllowLayerRemoval} />
              {onFileImport && <LayerPanelActionImport handleImport={onFileImport} />}
              {onExportFeatures && <LayerPanelActionExport onExportFeatures={onExportFeatures} />}
            </LayerPanelActions>} />
        {enableFilter &&
          <TextField
            id='feature-filter-input'
            label={translations['olKit.LayerPanelLayersPage.filterText']}
            type='text'
            style={{ margin: '8px' }}
            fullWidth
            value={filterText}
            onChange={(e) => this.handleFilter(e.target.value)} />
        }
        <LayerPanelContent>
          <LayerPanelList
            disableDrag={disableDrag}
            onSort={this.zIndexSort}
            onReorderedItems={this.reorderLayers}
            items={layers} >
            {layerFilter(layers).filter((layer) => {
              const filteredFeatures = this.getFeaturesForLayer(layer)

              return !enableFilter || !(layer instanceof olLayerVector) ? true : filteredFeatures.length
            }).sort(this.zIndexSort).map((layer, i) => {
              const features = this.getFeaturesForLayer(layer)

              return (
                <div key={i}>
                  <LayerPanelListItem handleDoubleClick={() => { handleLayerDoubleClick(layer) }}>
                    {<LayerPanelCheckbox
                      checkboxState={!layer ? null : layer.getVisible()}
                      handleClick={(e) => this.handleVisibility(e, layer)} />}
                    {<LayerPanelExpandableList
                      show={!!features}
                      open={expandedLayer}
                      handleClick={this.handleExpandedLayer} />}
                    <ListItemText primary={layer.get('title') || 'Untitled Layer'} />
                    <ListItemSecondaryAction>
                      <LayerPanelActions
                        icon={<MoreVertIcon />}
                        translations={translations}
                        layer={layer}
                        map={map} >
                        {getMenuItemsForLayer(layer) ||
                        [<LayerPanelActionRemove key='removeLayer' shouldAllowLayerRemoval={shouldAllowLayerRemoval} />,
                          <LayerPanelActionExtent key='gotoExtent' />,
                          <LayerPanelActionOpacity key='layerOpacity' />]}
                      </LayerPanelActions>
                    </ListItemSecondaryAction>
                  </LayerPanelListItem>
                  { features
                    ? <Collapse in={expandedLayer} timeout='auto' unmountOnExit>
                      <List component='div' disablePadding style={{ paddingLeft: '36px' }}>
                        {features.map((feature, i) => {
                          return (
                            <ListItem key={i} hanldeDoubleClick={() => handleFeatureDoubleClick(feature)}>
                              <LayerPanelCheckbox
                                handleClick={(event) => this.handleFeatureCheckbox(layer, feature, event)}
                                checkboxState={feature.get('_feature_visibility')} />
                              <ListItemText inset={false} primary={feature.get('name') || `${translations['olKit.LayerPanelListItem.feature']} ${i}`} />
                            </ListItem>
                          )
                        })}
                      </List>
                    </Collapse> : null }
                </div>
              )
            })}
          </LayerPanelList>
        </LayerPanelContent>
      </LayerPanelPage>
    )
  }
}

LayerPanelLayersPage.defaultProps = {
  handleFeatureDoubleClick: () => {},
  handleLayerDoubleClick: () => {},
  handleDoubleClick: () => {},
  layerFilter: (layers) => layers.filter(layer => !layer.get('_ol_kit_basemap') && layer.get('name') !== 'unselectable'),
  shouldHideFeatures: (layer) => false,
  shouldAllowLayerRemoval: (layer) => true,
  getMenuItemsForLayer: () => false,
  tabIcon: <LayersIcon />,
  translations: {
    'geokit.LayerPanelListPage.title': 'Active Layers',
    'geokit.LayerPanelListPage.filterText': 'Filter Layers'
  }
}

LayerPanelLayersPage.propTypes = {
  /** Object with key/value pairs for translated strings */
  translations: PropTypes.object,

  /** An Openlayer map from which the layer panel will derive its layers  */
  map: PropTypes.object,

  /** The icon for the page shown in the left side of the layer panel */
  tabIcon: PropTypes.node,

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

  /** A callback function that returns the file type and the features that are being exported */
  onExportFeatures: PropTypes.func,

  /** A callback function to set custom Menu Items for a specific layer. Should recieve an array of `@material-ui/core/MenuItem` */
  getMenuItemsForLayer: PropTypes.func,

  /** A callback function passed the features imported from 'kmz', 'kml', 'geojson', 'wkt', 'csv', 'zip', and 'json' file types */
  onFileImport: PropTypes.func,

  /** A boolean to disable the drag event on the LayerPanelList */
  disableDrag: PropTypes.bool
}

export default LayerPanelLayersPage
