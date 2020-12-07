import React, { Component } from 'react'
import PropTypes from 'prop-types'
import LayerPanelPage from 'LayerPanel/LayerPanelPage'
import LayerPanelHeader from 'LayerPanel/LayerPanelHeader'
import LayerPanelContent from 'LayerPanel/LayerPanelContent'
import LayerPanelList from 'LayerPanel/LayerPanelList'
import LayerPanelListItem from 'LayerPanel/LayerPanelListItem'
import LayerPanelCheckbox from 'LayerPanel/LayerPanelCheckbox'
import LayerPanelExpandableList from 'LayerPanel/_LayerPanelExpandableList'
import LayerPanelActions from 'LayerPanel/LayerPanelActions'
import { ListItem, ListItemText } from 'LayerPanel/LayerPanelListItem/styled'
import { ListItemSecondaryAction } from './styled'
import List from '@material-ui/core/List'
import Collapse from '@material-ui/core/Collapse'
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
import olStyleFill from 'ol/style/fill'
import olStyleStroke from 'ol/style/stroke'
import olStyleCircle from 'ol/style/circle'

import LayerPanelActionImport from 'LayerPanel/LayerPanelActionImport'
import LayerPanelActionExport from 'LayerPanel/LayerPanelActionExport'

const INDETERMINATE = 'indeterminate'

const fill = new olStyleFill({
  color: 'rgba(255,255,255,0.4)'
})

const stroke = new olStyleStroke({
  color: '#3399CC',
  width: 1.25
})

const DEFAULT_DRAW_STYLE = [
  new olStyleStyle({
    image: new olStyleCircle({
      fill: fill,
      stroke: stroke,
      radius: 5
    }),
    fill: fill,
    stroke: stroke
  })
]

/**
 * @component
 * @category LayerPanel
 * @since 0.5.0
 */
class LayerPanelLayersPage extends Component {
  constructor (props) {
    super(props)

    this.state = {
      layers: [],
      masterCheckboxVisibility: true,
      featureListeners: [],
      filterText: null,
      expandedLayers: []
    }
  }

  componentDidMount = () => {
    const { map, layerFilter } = this.props
    const layers = map.getLayers()
    const handleMapChange = (e, add) => {
      const filteredLayers = layerFilter(layers.getArray())

      // if we're adding a layer we want to add it to the top of the list but not update any of the other layers zIndex
      if (add) {
        const safeFilteredLayersLength = filteredLayers ? filteredLayers.length - 1 : 0

        filteredLayers[safeFilteredLayersLength] && filteredLayers[safeFilteredLayersLength].setZIndex(filteredLayers.length) // eslint-disable-line
      }

      console.log(filteredLayers.sort(this.zIndexSort), layers)

      this.setState({ layers: filteredLayers.sort(this.zIndexSort) }, this.bindFeatureListeners)
    }

    // we call this to re-retrieve the layers on mount
    handleMapChange()

    // we call this to re-adjust the master checkbox as needed
    this.handleMasterCheckbox()

    // bind the event listeners
    this.onAddKey = layers.on('add', (e) => handleMapChange(e, true))
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
      const isVisible = feature.get('_ol_kit_feature_visibility') === undefined ? true : feature.get('_ol_kit_feature_visibility')
      const iaFeatureStyle = feature.get('_ol_kit_feature_style') || feature.getStyle() || DEFAULT_DRAW_STYLE
      const featureStyle = isVisible ? iaFeatureStyle : new olStyleStyle()

      feature.set('_ol_kit_feature_visibility', isVisible)
      // in order to do feature visibility we have to set the features style to nil... which means that we need to store
      // the original style so that when it becomes visible again we can set it to the original style
      if (feature.get('_ol_kit_feature_style') === undefined) feature.set('_ol_kit_feature_style', iaFeatureStyle)
      feature.setStyle(featureStyle)

      return feature
    }).filter((feature) => {
      return !this.props.enableFilter || !this.state.filterText ? true : feature.get('name').toLowerCase().includes(this.state.filterText.toLowerCase())
    })
  }

  getVisibleFeaturesForLayer = (layer) => {
    return (this.isValidVectorLayer(layer))
      ? layer.getSource().getFeatures().filter(feature => feature.get('_ol_kit_feature_visibility')) : []
  }

  setVisibilityForAllFeaturesOfLayer = (layer, visibility) => {
    if (this.isValidVectorLayer(layer)) {
      layer.getSource().getFeatures().map(feature => {
        feature.set('_ol_kit_feature_visibility', visibility)
        feature.setStyle(feature.get('_ol_kit_feature_style'))
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
    feature.set('_ol_kit_feature_visibility', !feature.get('_ol_kit_feature_visibility'))
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

  handleExpandedLayer = (layer) => {
    const clonedExpandedLayers = [...this.state.expandedLayers]
    const index = clonedExpandedLayers.indexOf(layer.ol_uid)

    index > -1 ? clonedExpandedLayers.splice(index, 1) : clonedExpandedLayers.push(layer.ol_uid)

    this.setState({ expandedLayers: clonedExpandedLayers })
  }

  // highest zIndex should be at the front of the list (reverse order of array index)
  zIndexSort = (a, b) => b.getZIndex() - a.getZIndex()

  reorderLayers = (reorderedLayers) => {
    // apply the z-index changes down to all layers
    reorderedLayers.map((l, i) => l.setZIndex(reorderedLayers.length - i))

    this.setState({ layers: reorderedLayers })
  }

  render () {
    const {
      translations, layerFilter, handleFeatureDoubleClick, handleLayerDoubleClick, disableDrag,
      customActions, enableFilter, getMenuItemsForLayer, shouldAllowLayerRemoval, map, onFileImport, onExportFeatures
    } = this.props
    const { layers, masterCheckboxVisibility, filterText, expandedLayers } = this.state
    const isExpandedLayer = (layer) => !!expandedLayers.find(expandedLayerId => expandedLayerId === layer.ol_uid)

    return (
      <LayerPanelPage>
        <LayerPanelHeader
          title={translations['_ol_kit.LayerPanelLayersPage.title']}
          translations={translations}
          avatar={<LayerPanelCheckbox
            checkboxState={masterCheckboxVisibility} handleClick={this.setVisibilityForAllLayers} />}
          actions={customActions ||
            <LayerPanelActions
              icon={<MoreHorizIcon data-testid='LayerPanel.masterActionsIcon' />}
              translations={translations}
              layers={layers}
              map={map}>
              <LayerPanelActionRemove
                removeFeaturesForLayer={this.removeFeaturesForLayer}
                shouldAllowLayerRemoval={shouldAllowLayerRemoval} />
              {onFileImport && <LayerPanelActionImport handleImport={onFileImport} />}
              <LayerPanelActionExport onExportFeatures={onExportFeatures} />
            </LayerPanelActions>} />
        {enableFilter &&
          <TextField
            id='feature-filter-input'
            label={translations['_ol_kit.LayerPanelLayersPage.filterText']}
            type='text'
            style={{ margin: '8px' }}
            fullWidth
            value={filterText}
            onChange={(e) => this.handleFilter(e.target.value)} />
        }
        <LayerPanelContent padding='0px 15px'>
          <LayerPanelList
            disableDrag={disableDrag}
            onSort={this.zIndexSort}
            onReorderedItems={this.reorderLayers}
            items={layers} >
            {layerFilter(layers).filter((layer) => {
              const filteredFeatures = this.getFeaturesForLayer(layer)

              return !enableFilter || !(layer instanceof olLayerVector) || this.props.shouldHideFeatures(layer) ? true : filteredFeatures.length
            }).map((layer, i) => {
              const features = this.getFeaturesForLayer(layer)

              return (
                <div key={i}>
                  <LayerPanelListItem handleDoubleClick={() => { handleLayerDoubleClick(layer) }}>
                    {<LayerPanelCheckbox
                      checkboxState={!layer ? null : layer.getVisible()}
                      handleClick={(e) => this.handleVisibility(e, layer)} />}
                    {<LayerPanelExpandableList
                      show={!!features}
                      open={isExpandedLayer(layer)}
                      handleClick={() => this.handleExpandedLayer(layer)} />}
                    <ListItemText primary={layer.get('title') || 'Untitled Layer'} />
                    <ListItemSecondaryAction style={{ right: '0px !important' }}>
                      <LayerPanelActions
                        icon={<MoreVertIcon data-testid='LayerPanel.actionsIcon' />}
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
                    ? <Collapse in={isExpandedLayer(layer)} timeout='auto' unmountOnExit>
                      <List component='div' disablePadding style={{ paddingLeft: '36px' }}>
                        {features.map((feature, i) => {
                          return (
                            <ListItem data-testid={`LayerPanel.feature${i}`} key={i} onDoubleClick={() => handleFeatureDoubleClick(feature)}>
                              <LayerPanelCheckbox
                                handleClick={(event) => this.handleFeatureCheckbox(layer, feature, event)}
                                checkboxState={feature.get('_ol_kit_feature_visibility')} />
                              <ListItemText inset={false} primary={feature.get('name') || `${translations['_ol_kit.LayerPanelListItem.feature']} ${i + 1}`} />
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
  layerFilter: (layers) => layers.filter(layer => !layer.get('_ol_kit_basemap') && layer.get('name') !== 'unselectable'),
  shouldHideFeatures: (layer) => false,
  shouldAllowLayerRemoval: (layer) => true,
  getMenuItemsForLayer: () => false,
  tabIcon: <LayersIcon />
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
