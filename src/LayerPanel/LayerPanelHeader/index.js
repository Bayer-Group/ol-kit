import React, { Component } from 'react'
import { HeaderContainer, CardHeader, ActionsContainer } from './styled'
import { Checkbox } from '../styled'
import LayerPanelMenu from 'LayerPanel/LayerPanelMenu'
import PropTypes from 'prop-types'

import Icon from '@mdi/react'
import { mdiCheckboxBlank } from '@mdi/js'
import LayerPanelActionRemove from 'LayerPanel/LayerPanelActionRemove'
import LayerPanelActionImport from 'LayerPanel/LayerPanelActionImport'
import LayerPanelActionExport from 'LayerPanel/LayerPanelActionExport'

import IconButton from '@material-ui/core/IconButton'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'

/**
 * @component
 * @category vmc
 */
class LayerPanelHeader extends Component {
  constructor () {
    super()
    this.state = {
      anchorEl: null
    }
  }

  setVisibilityForAllLayers = (show) => {
    this.props.setVisibilityForAllLayers(!show)
    this.props.handleMasterCheckbox()
  }

  handleMenuClick = ({ currentTarget }) => {
    this.setState({ anchorEl: currentTarget })
  }

  handleMenuClose = () => {
    this.setState({ anchorEl: null })
  }

  render () {
    const {
      translations,
      children,
      title,
      masterCheckboxVisibility,
      layers,
      customActions,
      map
    } = this.props
    const { anchorEl } = this.state
    const CheckBox = masterCheckboxVisibility === 'indeterminate'
      ? <Checkbox indeterminateIcon={<Icon path={mdiCheckboxBlank} size={1} color='#152357' />}
        onClick={() => this.setVisibilityForAllLayers(false)} checked={masterCheckboxVisibility} indeterminate />
      : <Checkbox onClick={() => this.setVisibilityForAllLayers(masterCheckboxVisibility)}
        checked={masterCheckboxVisibility} />

    console.log(<LayerPanelMenu />)


    return (
      <CardHeader
        title={title}
        avatar={CheckBox}
        action={
          <ActionsContainer>
            <IconButton aria-label='more' aria-haspopup='true' onClick={this.handleMenuClick}>
              <MoreHorizIcon />
            </IconButton>
            <LayerPanelMenu
              anchorEl={anchorEl}
              open={!!anchorEl}
              handleMenuClose={this.handleMenuClose}
              translations={translations}
              layers={layers}
              map={map} >
              {children}
            </LayerPanelMenu>
          </ActionsContainer>
        } />
    )
  }
}

LayerPanelHeader.propTypes = {
  /** Object with key/value pairs for translated strings */
  translations: PropTypes.object,

  /** A boolean for rendering the default actions of the LayerPanelHeader */
  defaultActions: PropTypes.bool,

  /** A boolean to show the default checkbox of the LayerPanelHeader */
  masterCheckbox: PropTypes.bool,

  /** The content of the LayerPanelHeader (likely `CardHeader` components) */
  children: PropTypes.node,

  /** A string for the LayerPanelHeader title */
  title: PropTypes.string,

  /** A boolean that will check the Checkbox */
  masterCheckboxChecked: PropTypes.bool,

  setVisibilityForAllLayers: PropTypes.func,
  handleMasterCheckbox: PropTypes.func,
  handleExport: PropTypes.func,
  handleImport: PropTypes.func,
  masterCheckboxVisibility: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string
  ]),
  isExportable: PropTypes.bool,
  noVisibleLayers: PropTypes.bool,
  handleRemove: PropTypes.func,

  /** components to be rendered in the actions menu */
  customActions: PropTypes.node,

  /** boolean allowing opt out of drop down menu */
  hideActions: PropTypes.bool
}

LayerPanelHeader.defaultProps = {
  defaultActions: false,
  masterCheckbox: false,
  hideActions: false
}

export default LayerPanelHeader
