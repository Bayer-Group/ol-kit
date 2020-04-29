import React, { Component } from 'react'
import { CardContent } from './styled'
import PropTypes from 'prop-types'

/**
 * @component
 * @category LayerPanel
 * @since 0.5.0
 */
class LayerPanelContent extends Component {
  render () {
    const { children } = this.props

    return (
      <CardContent {...this.props}>
        {children}
      </CardContent>
    )
  }
}

LayerPanelContent.propTypes = {
  /** The content of the LayerPanelContent (likely a collection of `LayerPanelList` components) */
  children: PropTypes.node
}

export default LayerPanelContent
