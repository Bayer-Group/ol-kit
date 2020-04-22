import React, { Component } from 'react'
import { ListItem, ListItemText } from './styled'
import LayerPanelMenu from 'LayerPanel/LayerPanelMenu'
import PropTypes from 'prop-types'
import { Checkbox } from '../styled'
import List from '@material-ui/core/List'
import Collapse from '@material-ui/core/Collapse'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import IconButton from '@material-ui/core/IconButton'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import ExpandLess from '@material-ui/icons/ExpandMore'
import ExpandMore from '@material-ui/icons/ChevronRight'

import Icon from '@mdi/react'
import { mdiCheckboxBlank } from '@mdi/js'
import LayerPanelActionOpacity from 'LayerPanel/LayerPanelActionOpacity'
import LayerPanelActionRemove from 'LayerPanel/LayerPanelActionRemove'
import LayerPanelActionExtent from 'LayerPanel/LayerPanelActionExtent'

/**
 * @component
 * @category vmc
 */
class LayerPanelListItem extends Component {
  constructor (props) {
    super(props)

    this.state = {
      anchorEl: null,
      checked: props.checked,
      expandedLayer: false,
      visible: props.layer ? props.layer.getVisible() : null
    }
  }

  componentDidUpdate (nextProps) {
    if (this.state.visible !== nextProps.layer.getVisible()) {
      this.setState({ visible: nextProps.layer.getVisible() })
    }
  }

  handleMenuClick = ({ currentTarget }) => {
    this.setState({ anchorEl: currentTarget })
  }

  handleMenuClose = () => {
    this.setState({ anchorEl: null })
  }

  handleExpandedLayer = () => {
    this.setState(state => ({ expandedLayer: !state.expandedLayer }))
  }

  handleVisibility = (event) => {
    const { layer } = this.props

    event.stopPropagation()

    this.props.handleMasterCheckbox()
    this.props.handleLayerCheckbox(layer, true)
  }

  handleFeatureCheckbox = (layer, feature, event) => {
    const { handleFeatureCheckbox } = this.props

    event.stopPropagation()

    handleFeatureCheckbox(layer, feature)
  }

  render () {
    const { translations, title, defaultCheckboxes, defaultMenu, menuItems,
      children, features, layer, gotoLayerExtent, handleFeatureDoubleClick,
      handleLayerDoubleClick, shouldAllowLayerRemoval, removeLayer, map } = this.props
    const { anchorEl, expandedLayer } = this.state
    /** If there are no features then return null otherwise check if the layer is expanded if not return null */
    const arrowButton = !features ? null : expandedLayer // eslint-disable-line
      ? <ExpandLess onClick={this.handleExpandedLayer} />
      : <ExpandMore onClick={this.handleExpandedLayer} />

    const CheckBox = !layer ? null : layer.getVisible() === 'indeterminate' // eslint-disable-line
      ? <Checkbox indeterminateIcon={<Icon path={mdiCheckboxBlank} size={1} color='#152357' />}
        onClick={this.handleVisibility} checked={true} indeterminate />
      : <Checkbox onClick={this.handleVisibility} checked={layer.getVisible()} />

    console.log(menuItems)

    if (children) {
      return (
        <ListItem>
          {children}
        </ListItem>
      )
    } else {
      return (
        <div>
          <ListItem key={title} onDoubleClick={() => { handleLayerDoubleClick(layer) }}>
            {defaultCheckboxes && CheckBox}
            {arrowButton}
            <ListItemText primary={title} />
            {defaultMenu &&
              <div>
                <ListItemSecondaryAction>
                  <IconButton aria-owns={anchorEl ? 'simple-menu' : undefined} aria-haspopup='true' onClick={this.handleMenuClick}>
                    <MoreVertIcon />
                  </IconButton>
                </ListItemSecondaryAction>
                <LayerPanelMenu
                  layer={layer}
                  id='simple-menu'
                  open={Boolean(anchorEl)}
                  anchorEl={anchorEl}
                  handleMenuClose={this.handleMenuClose}
                  shouldAllowLayerRemoval={shouldAllowLayerRemoval}
                  map={map}
                  translations={translations}>
                  {menuItems ||
                    [<LayerPanelActionRemove key='removeLayer' />,
                      <LayerPanelActionExtent key='gotoExtent' />,
                      <LayerPanelActionOpacity key='layerOpacity' />]}
                </LayerPanelMenu>
              </div>
            }
          </ListItem>
          { features
            ? <Collapse in={expandedLayer} timeout='auto' unmountOnExit>
              <List component='div' disablePadding style={{ paddingLeft: '36px' }}>
                {features.map((feature, i) => {
                  return (
                    <ListItem key={i} onDoubleClick={() => handleFeatureDoubleClick(feature)}>
                      <Checkbox onClick={(event) => this.handleFeatureCheckbox(layer, feature, event)} checked={feature.get('_feature_visibility')} />
                      <ListItemText inset={false} primary={feature.get('_vmf_name') || feature.get('name') || `${translations['olKit.LayerPanelListItem.feature']} ${i}`} />
                    </ListItem>
                  )
                })}
              </List>
            </Collapse> : null }
        </div>
      )
    }
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
