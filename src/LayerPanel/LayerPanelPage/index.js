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
    const { children } = this.props

    return (
      <LayerPanelPageContainer data-testid='LayerPanel.page'>
        {children}
      </LayerPanelPageContainer>
    )
  }
}

LayerPanelPage.propTypes = {
  /** An array of components (likely a LayerPanelHeader, LayerPanelContent, or LayerPanelFooter) */
  children: PropTypes.node
}

export default LayerPanelPage
