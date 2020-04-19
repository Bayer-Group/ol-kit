import React, { Component } from 'react'
import { HeaderContainer, CardHeader } from './styled'
import { Checkbox } from '../styled'
import LayerPanelActions from '../LayerPanelActions'
import PropTypes from 'prop-types'

import Icon from '@mdi/react'
import { mdiCheckboxBlank } from '@mdi/js'

/**
 * @component
 * @category vmc
 */
class LayerPanelHeader extends Component {
  setVisibilityForAllLayers = (show) => {
    this.props.setVisibilityForAllLayers(!show)
    this.props.handleMasterCheckbox()
  }

  render () {
    const {
      translations,
      children,
      title,
      defaultActions,
      masterCheckbox,
      handleExport,
      masterCheckboxVisibility,
      handleImport,
      isExportable,
      noVisibleLayers,
      hideActions
    } = this.props
    const CheckBox = masterCheckboxVisibility === 'indeterminate'
      ? <Checkbox indeterminateIcon={<Icon path={mdiCheckboxBlank} size={1} color='#152357' />}
        onClick={() => this.setVisibilityForAllLayers(false)} checked={masterCheckboxVisibility} indeterminate />
      : <Checkbox onClick={() => this.setVisibilityForAllLayers(masterCheckboxVisibility)}
        checked={masterCheckboxVisibility} />

    if (children) {
      return <HeaderContainer>{children}</HeaderContainer>
    } else {
      return (
        <CardHeader
          title={title}
          avatar={masterCheckbox && CheckBox}
          action={
            hideActions ? null : (
              <LayerPanelActions
                translations={translations}
                handleRemove={this.props.handleRemove}
                handleExport={handleExport}
                handleImport={handleImport}
                isExportable={isExportable}
                noVisibleLayers={noVisibleLayers}
                showDefaultActions={defaultActions}
              >
                {this.props.customActions}
              </LayerPanelActions>
            )
          } />
      )
    }
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
