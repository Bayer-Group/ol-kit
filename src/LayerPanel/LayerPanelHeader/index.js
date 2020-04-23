import React, { Component } from 'react'
import { CardHeader } from './styled'
import PropTypes from 'prop-types'

/**
 * @component
 * @category vmc
 */
class LayerPanelHeader extends Component {
  render () {
    const {
      actions,
      title,
      avatar
    } = this.props

    return (
      <CardHeader title={title} avatar={avatar} action={actions} />
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
