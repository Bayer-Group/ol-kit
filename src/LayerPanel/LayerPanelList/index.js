import React, { Component } from 'react'

import List from '@material-ui/core/List'
import LayerPanelListItem from 'LayerPanel/LayerPanelListItem'
import { Container, Draggable } from 'react-smooth-dnd'

import PropTypes from 'prop-types'

const applyDrag = (arr, dragResult) => {
  const { removedIndex, addedIndex, payload } = dragResult

  if (removedIndex === null && addedIndex === null) return arr

  const result = [...arr]

  let layerToAdd = payload

  if (removedIndex !== null) {
    layerToAdd = result.splice(removedIndex, 1)[0]
  }

  if (addedIndex !== null) {
    result.splice(addedIndex, 0, layerToAdd)
  }

  return result
}

/**
 * @component
 * @category vmc
 */
class LayerPanelList extends Component {
  // highest zIndex should be at the front of the list (reverse order of array index)
  zIndexSort = (a, b) => b.getZIndex() - a.getZIndex()

  onDrop = e => {
    const reorderedLayers = applyDrag(this.props.layers.sort(this.zIndexSort), e)

    // apply the z-index changes down to all layers
    reorderedLayers.map((l, i) => l.setZIndex(reorderedLayers.length - i))

    // the component is props-based so force a re-render
    this.forceUpdate()
  }

  renderlayers = () => {
    const {
      layers,
      translations,
      defaultCheckboxes,
      getMenuItemsForLayer,
      handleMasterCheckbox,
      gotoLayerExtent,
      handleFeatureCheckbox,
      getFeaturesForLayer,
      handleLayerCheckbox,
      handleFeatureDoubleClick,
      handleLayerDoubleClick,
      shouldAllowLayerRemoval,
      removeLayer,
      map
    } = this.props

    return layers.sort(this.zIndexSort).map(layer => {
      const features = getFeaturesForLayer(layer)

      return (
        <Draggable key={layer.ol_uid}>
          <LayerPanelListItem
            translations={translations}
            gotoLayerExtent={gotoLayerExtent}
            handleMasterCheckbox={handleMasterCheckbox}
            handleFeatureCheckbox={handleFeatureCheckbox}
            handleLayerCheckbox={handleLayerCheckbox}
            handleFeatureDoubleClick={handleFeatureDoubleClick}
            handleLayerDoubleClick={handleLayerDoubleClick}
            shouldAllowLayerRemoval={shouldAllowLayerRemoval}
            removeLayer={removeLayer}
            layer={layer}
            map={map}
            features={features}
            layerId={layer.get('_id')}
            title={layer.get('title') || 'Untitled Layer'}
            menuItems={getMenuItemsForLayer && getMenuItemsForLayer(layer)}
            defaultCheckboxes={defaultCheckboxes} />
        </Draggable>
      )
    })
  }

  renderChildren = () => {
    return React.Children.map(this.props.children, child => <Draggable key={child.id}>{child}</Draggable>)
  }

  render () {
    const { children } = this.props

    return (
      <List>
        <Container onDrop={this.onDrop}>
          {children ? this.renderChildren() : this.renderlayers()}
        </Container>
      </List>
    )
  }
}

LayerPanelList.propTypes = {
  /** Object with key/value pairs for translated strings */
  translations: PropTypes.object,

  /** An array of objects that have a title prop */
  layers: PropTypes.array,

  /** The content of the LayerPanelList (likely `LayerPanelListItem` components) */
  children: PropTypes.node,

  /** An array of Menulayers (from `@material-ui-core/Menulayer`) */
  menuItems: PropTypes.array,

  /** A boolean that renders the default LayerPanel checkboxes for a Listlayer */
  defaultCheckboxes: PropTypes.bool,

  /** Callback for getting the features for an OL layer by passing the id of the layer */
  getFeaturesForLayer: PropTypes.func,

  /** Callback which FIXME */
  handleMasterCheckbox: PropTypes.func,
  gotoLayerExtent: PropTypes.func,
  handleFeatureCheckbox: PropTypes.func,
  handleLayerCheckbox: PropTypes.func,
  handleLayerZindex: PropTypes.func,
  getMenuItemsForLayer: PropTypes.func,
  handleFeatureDoubleClick: PropTypes.func,
  handleLayerDoubleClick: PropTypes.func
}

export default LayerPanelList
