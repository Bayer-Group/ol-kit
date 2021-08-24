import React, { memo, PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Virtuoso } from 'react-virtuoso'
import LayerPanelPage from 'LayerPanel/LayerPanelPage'
import LayerPanelContent from 'LayerPanel/LayerPanelContent'
import LayerPanelList from 'LayerPanel/LayerPanelList'
import LayerPanelListItem from 'LayerPanel/LayerPanelListItem'
import LayerPanelCheckbox from 'LayerPanel/LayerPanelCheckbox'
import LayerPanelExpandableList from 'LayerPanel/_LayerPanelExpandableList'
import LayerPanelActions from 'LayerPanel/LayerPanelActions'
import { ListItem, ListItemText } from 'LayerPanel/LayerPanelListItem/styled'
import { ListItemSecondaryAction } from './styled'
import Collapse from '@material-ui/core/Collapse'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import LayersIcon from '@material-ui/icons/Layers'
import olStroke from 'ol/style/Stroke'
import olFill from 'ol/style/Fill'
import olCircle from 'ol/style/Circle'
import ugh from 'ugh'

import { addSelectInteraction } from 'Map'

import MoreHorizIcon from '@material-ui/icons/MoreHoriz'

import LayerPanelActionOpacity from 'LayerPanel/LayerPanelActionOpacity'
import LayerPanelActionRemove from 'LayerPanel/LayerPanelActionRemove'
import LayerPanelActionExtent from 'LayerPanel/LayerPanelActionExtent'
import LayerPanelActionHeatmap from 'LayerPanel/LayerPanelActionHeatmap'

import TextField from '@material-ui/core/TextField'

import olLayerVector from 'ol/layer/Vector'
import olSourceVector from 'ol/source/Vector'
import olStyleStyle from 'ol/style/Style'

import LayerPanelActionImport from 'LayerPanel/LayerPanelActionImport'
import LayerPanelActionExport from 'LayerPanel/LayerPanelActionExport'
import LayerPanelActionMerge from 'LayerPanel/LayerPanelActionMerge'

import isEqual from 'lodash.isequal'
import { connectToContext } from 'Provider'
import { convertFileToFeatures } from 'LayerPanel/LayerPanelActionImport/utils'
import VectorLayer from 'classes/VectorLayer'

const INDETERMINATE = 'indeterminate'

const FeatureRow = (index, data) => {
  console.log('FeatureRow data', data)
  const { feature, handleFeatureCheckbox, handleFeatureDoubleClick, layer, translations } = data
  console.log('FeatureRow', FeatureRow)

  return (
    <ListItem data-testid={`LayerPanel.feature${index}`} key={index} onDoubleClick={() => handleFeatureDoubleClick(feature)}>
      <LayerPanelCheckbox
        handleClick={(event) => handleFeatureCheckbox(layer, feature, event)}
        checkboxState={feature.get('_ol_kit_feature_visibility')} />
      <ListItemText inset={false} primary={feature.get('name') || `${translations['_ol_kit.LayerPanelListItem.feature']} ${index + 1}`} />
    </ListItem>
  )
}

/**
 * @component
 * @category LayerPanel
 * @since 0.5.0
 */
class LayerPanelLayersPage extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      layers: [],
      masterCheckboxVisibility: true,
      featureListeners: [],
      filterText: '',
      expandedLayers: []
    }
  }

  initializeSelect = map => {
    const { setHoverStyle, disableHover } = this.props

    if (disableHover) return // opt-out

    const { stroke = 'red', fill = '#ffffff', color = 'red' } = setHoverStyle()

    const style = new olStyleStyle({
      stroke: new olStroke({
        color: stroke,
        width: 3
      }),
      image: new olCircle({
        radius: 5,
        fill: new olFill({
          color: fill
        }),
        stroke: new olStroke({
          color: color,
          width: 2
        })
      })
    })

    const { select } = addSelectInteraction(map, '_ol_kit_layer_panel_hover', { style: [style] })

    this.selectInteraction = select
  }

  selectFeatures = features => {
    const { disableHover } = this.props

    if (disableHover) return
    // clear the previously selected feature before adding newly selected feature so only one feature is "selected" at a time
    this.selectInteraction.getFeatures().clear()

    if (features?.length) {
      features.forEach(feature => {
        if (feature.get('_ol_kit_feature_visibility')) {
          this.selectInteraction.getFeatures().push(feature)
        }
      })
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

      this.setState({ layers: filteredLayers.sort(this.zIndexSort) }, this.bindFeatureListeners)
    }

    // we call this to re-retrieve the layers on mount
    handleMapChange()
    this.initializeSelect(map)
    // we call this to re-adjust the master checkbox as needed
    this.handleMasterCheckbox()

    // bind the event listeners
    this.onAddKey = layers.on('add', (e) => handleMapChange(e, true))
    this.onRemoveKey = layers.on('remove', handleMapChange)
  }

  componentWillUnmount = () => {
    const { map } = this.props
    const layers = map.getLayers()

    // unbind the listeners
    layers.unset(this.onAddKey)
    layers.unset(this.onRemoveKey)
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
      if (this.props.shouldHideFeatures(layer)) return

      const isVectorLayer = this.isValidVectorLayer(layer)
      const canGetSource = typeof layer.getSource === 'function'
      const hasVectorSource = canGetSource && layer.getSource() instanceof olSourceVector

      if (!isVectorLayer && !hasVectorSource) return [...listeners]

      const source = layer.getSource()
      const addFeature = source.on('addfeature', this.handleFeatureChange)
      const removeFeature = source.on('removefeature', this.handleFeatureChange)

      return [...listeners, [source, addFeature], [source, removeFeature]]
    }, [])

    this.setState({ featureListeners })
  }

  removeFeatureListeners = () => {
    const { featureListeners = [] } = this.state

    Array.isArray(featureListeners) && featureListeners.forEach(([source, listener]) => {
      source.unset(listener)
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
      const olkitStyle = feature.get('_ol_kit_feature_style') || feature.getStyle()
      const featureOriginalStyle = isEqual(olkitStyle, new olStyleStyle(null)) ? undefined : olkitStyle
      const featureStyle = isVisible ? featureOriginalStyle : new olStyleStyle()

      feature.set('_ol_kit_feature_visibility', isVisible)
      if (feature.get('_ol_kit_feature_style') === undefined) feature.set('_ol_kit_feature_style', featureStyle)
      feature.setStyle(featureStyle)

      return feature
    }).filter((feature) => {
      const name = feature.get('name')

      return !this.props.enableFilter || !this.state.filterText || !name
        ? true : name.toLowerCase().includes(this.state.filterText.toLowerCase())
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
    const indeterminateLayers = this.getVisibleLayers().filter(layer => layer.get('_ol_kit_layerpanel_visibility') === INDETERMINATE).length

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
      layer.set('_ol_kit_layerpanel_visibility', true)
    } else if (layerCheckboxClick) {
      const lv = !layer.getVisible()

      layer.setVisible(lv)
      layer.set('_ol_kit_layerpanel_visibility', lv)
    } else {
      layer.setVisible(layerVisibility === INDETERMINATE ? true : layerVisibility)
      layer.set('_ol_kit_layerpanel_visibility', layerVisibility)
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

  onFileImport = file => {
    const { map, onFileImport } = this.props

    // otherwise, add them to the map ourselves
    convertFileToFeatures(file, map).then(({ features, name }) => {
      // if a callback to handle imported features is passed, IAs handle add them to the map
      if (onFileImport) {
        features.forEach(({ featureArray, fileName }) => {
          onFileImport(featureArray, `${name}(${fileName})`)
        })
      // if no onFileImport prop is passed, create a layer, add it and center/zoom the map
      } else {
        features.forEach(({ featureArray, fileName }) => {
          const source = new olSourceVector({ features: featureArray })
          const layer = new VectorLayer({ title: `${name}(${fileName})`, source })

          map.addLayer(layer)
          map.getView().fit(source.getExtent(), map.getSize())
        })
      }
    }).catch(ugh.error)
  }

  render () {
    const {
      translations, layerFilter, handleFeatureDoubleClick, handleLayerDoubleClick, disableDrag, tabIcon, onLayerRemoved,
      onLayerReorder, enableFilter, getMenuItemsForLayer, shouldAllowLayerRemoval, map, onExportFeatures, onMergeLayers, onCreateHeatmap
    } = this.props
    const { layers, masterCheckboxVisibility, filterText, expandedLayers } = this.state
    const isExpandedLayer = (layer) => !!expandedLayers.find(expandedLayerId => expandedLayerId === layer.ol_uid)

    return (
      <LayerPanelPage tabIcon={tabIcon}>
        <TextField
          id='feature-filter-input'
          label={translations['_ol_kit.LayerPanelLayersPage.filterText']}
          type='text'
          style={{ margin: '8px', display: enableFilter ? 'block' : 'none' }}
          fullWidth
          value={filterText}
          onChange={(e) => this.handleFilter(e.target.value)} />
        <LayerPanelContent padding={enableFilter ? '0px 15px 58px 15px !important' : '0px 15px'}>
          <LayerPanelListItem
            id='all_layers'
            title={translations['_ol_kit.LayerPanelLayersPage.title']}
            translations={translations} >
            <LayerPanelCheckbox
              checkboxState={masterCheckboxVisibility}
              handleClick={this.setVisibilityForAllLayers} />
            <ListItemText primary={'All Layers'} />
            <ListItemSecondaryAction style={{ right: '0px !important' }}>
              <LayerPanelActions
                icon={<MoreHorizIcon data-testid='LayerPanel.masterActionsIcon' />}
                translations={translations}
                layers={layers}
                map={map}>
                <LayerPanelActionRemove
                  removeFeaturesForLayer={this.removeFeaturesForLayer}
                  shouldAllowLayerRemoval={shouldAllowLayerRemoval}
                  onLayerRemoved={onLayerRemoved} />
                <LayerPanelActionImport handleImport={this.onFileImport} />
                <LayerPanelActionExport onExportFeatures={onExportFeatures} />
                <LayerPanelActionMerge onMergeLayers={onMergeLayers} />
              </LayerPanelActions>
            </ListItemSecondaryAction>
          </LayerPanelListItem>
          <LayerPanelList
            disableDrag={disableDrag}
            onSort={this.zIndexSort}
            onReorderedItems={this.reorderLayers}
            items={layers}
            onLayerReorder={onLayerReorder} >
            {layerFilter(layers).filter((layer) => {
              const filteredFeatures = this.getFeaturesForLayer(layer)

              return !enableFilter ||
                !(layer instanceof olLayerVector) ||
                this.props.shouldHideFeatures(layer) ? true : filteredFeatures?.length
            }).map((layer, i) => {
              const features = this.getFeaturesForLayer(layer)
              const isExpanded = isExpandedLayer(layer)
              const data = Array.from({ length: features.length }, 
                (_, index) => ({
                  feature: features[index],
                  handleFeatureCheckbox: this.handleFeatureCheckbox,
                  handleFeatureDoubleClick,
                  layer,
                  translations
                })
              )


              console.log('data', data)
              return (
                <div key={i}
                  onMouseEnter={() => this.selectFeatures(features)}
                  onMouseLeave={() => this.selectFeatures([])}>
                  <LayerPanelListItem handleDoubleClick={() => { handleLayerDoubleClick(layer) }}>
                    {<LayerPanelCheckbox
                      checkboxState={!layer ? null : layer.get('_ol_kit_layerpanel_visibility') || layer.getVisible()}
                      handleClick={(e) => this.handleVisibility(e, layer)} />}
                    {<LayerPanelExpandableList
                      show={!!features}
                      open={isExpanded}
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
                          <LayerPanelActionHeatmap key='heatmap' layer={layer} onCreateHeatmap={onCreateHeatmap} />,
                          <LayerPanelActionOpacity key='layerOpacity' />]}
                      </LayerPanelActions>
                    </ListItemSecondaryAction>
                  </LayerPanelListItem>
                  {isExpanded
                    ? <Collapse in={isExpanded} timeout='auto' unmountOnExit>
                        <Virtuoso
                          style={{ paddingLeft: '36px', height: features.length*52 > 300 ? 300 : features.length*52 }}
                          data={data}
                          itemContent={FeatureRow}
                        />
                      </Collapse>
                    : null
                  }
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
  onCreateHeatmap: () => {},
  tabIcon: <LayersIcon />,
  setHoverStyle: () => ({ color: 'red', fill: '#ffffff', stroke: 'red' }),
  disableHover: false
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
  onFileImport: PropTypes.func,

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

  /** A callback fired when a new heatmap is created */
  onCreateHeatmap: PropTypes.func,

  /** A callback function that returns the file type and the features that are being exported */
  onExportFeatures: PropTypes.func,

  /** A callback fired when layers are merged */
  onMergeLayers: PropTypes.func,

  /** A callback function to set custom Menu Items for a specific layer. Should recieve an array of `@material-ui/core/MenuItem` */
  getMenuItemsForLayer: PropTypes.func,

  /** A boolean to disable the drag event on the LayerPanelList */
  disableDrag: PropTypes.bool,

  /** A callback function to inform when layers are reordered */
  onLayerReorder: PropTypes.func,

  /** A callback function to inform when a layer is removed */
  onLayerRemoved: PropTypes.func,
  /** Truthy value will disable hover */
  disableHover: PropTypes.bool,

  /** Pass fill, stroke, and color hover style values */
  setHoverStyle: PropTypes.func
}

export default connectToContext(LayerPanelLayersPage)
