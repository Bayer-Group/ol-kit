import React, { Component } from 'react'
import { ListItem } from './styled'
import PropTypes from 'prop-types'

/**
 * @component
 * @category vmc
 */
class LayerPanelListItem extends Component {
  render () {
    const { title, item, children, handleDoubleClick } = this.props

    return (
      <ListItem key={title} onDoubleClick={() => { handleDoubleClick(item) }}>
        {children}
      </ListItem>
    )
  }
}

LayerPanelListItem.propTypes = {
  /** Object with key/value pairs for translated strings */
  translations: PropTypes.object,

  /** A string for the LayerPanelListItem title */
  title: PropTypes.string,

  /** A boolean that renders the default LayerPanel checkboxes for a ListItem */
  defaultCheckboxes: PropTypes.bool,

  /** A boolean that renders the default LayerPanel MenuItems for a ListItem */
  defaultMenu: PropTypes.bool,

  /** An array of MenuItems (from `Material-ui-core/MenuItem`) */
  menuItems: PropTypes.array,

  /** If children is passed, replace the title with children (the item still shows & checkbox & ellipses) */
  children: PropTypes.node,

  /** A boolean for selection of the layer item's checkbox */
  checked: PropTypes.bool,

  /** A callback for getting the features for an OL layer by passing the id of the layer */
  getFeaturesForLayer: PropTypes.func,

  /** An id associated with the OL layer id */
  layerId: PropTypes.string,

  /** Openlayers layer represented by the current list item */
  layer: PropTypes.object,

  /** Callback function called when the visibility of features changes */
  handleMasterCheckbox: PropTypes.func,

  /** Callback function called the layer checkbox is checked and passed the layer */
  handleLayerCheckbox: PropTypes.func,

  /** Callback function called when the 'go to layer extent' menu option is clicked */
  gotoLayerExtent: PropTypes.func,

  /** Callback function called when a feature checkbox is checked and passed the corresponding layer & feature  */
  handleFeatureCheckbox: PropTypes.func,

  /** Callback function when a feature is double clicked */
  handleFeatureDoubleClick: PropTypes.func,

  /** Callback function when a layer is double clicked */
  handleLayerDoubleClick: PropTypes.func,

  /** Array of OL features contained within the layer */
  features: PropTypes.array
}

LayerPanelListItem.defaultProps = {
  defaultCheckboxes: true,
  defaultMenu: true,
  handleFeatureDoubleClick: () => {},
  handleLayerDoubleClick: () => {},
  translations: {
    'olKit.LayerPanelListItem.feature': 'Feature'
  }
}

export default LayerPanelListItem
