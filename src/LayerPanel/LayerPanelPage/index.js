import React, { Component } from 'react'
import { LayerPanelPageContainer } from './styled'
import PropTypes from 'prop-types'

/**
 * @component
 * @category LayerPanel
 * @since 0.5.0
 */
class LayerPanelPage extends Component {
  render () {
    const { children, label, tabIcon } = this.props

    return (
      <LayerPanelPageContainer label={label} tabIcon={tabIcon} data-testid='LayerPanel.page'>
        {children}
      </LayerPanelPageContainer>
    )
  }
}

LayerPanelPage.propTypes = {
  /** An array of components (likely a LayerPanelHeader, LayerPanelContent, or LayerPanelFooter) */
  children: PropTypes.node,

  /** A string title of the page. Will be used as tab title. */
  label: PropTypes.string,

  /** A @material-ui/icon. Check LayerPanelPage example.md for more clarification */
  tabIcon: PropTypes.node
}

export default LayerPanelPage
