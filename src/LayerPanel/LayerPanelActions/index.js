import React, { Component } from 'react'
import { ActionsContainer } from './styled'
import IconButton from '@material-ui/core/IconButton'
import LayerPanelMenu from 'LayerPanel/LayerPanelMenu'

import PropTypes from 'prop-types'

/**
 * @component
 * @category LayerPanel
 * @since 0.4.0
 */
class LayerPanelActions extends Component {
  constructor () {
    super()
    this.state = {
      anchorEl: null
    }
  }

  handleMenuClick = ({ currentTarget }) => {
    this.setState({ anchorEl: currentTarget })
  }

  handleMenuClose = () => {
    this.setState({ anchorEl: null })
  }

  render () {
    const { icon, children, translations } = this.props
    const { anchorEl } = this.state

    return (
      <ActionsContainer>
        <IconButton data-testid='LayerPanel.actions' aria-label='more' aria-haspopup='true' onClick={this.handleMenuClick}>
          {icon}
        </IconButton>
        <LayerPanelMenu
          {...this.props}
          translations={translations}
          anchorEl={anchorEl}
          open={!!anchorEl}
          handleMenuClose={this.handleMenuClose}>
          {React.Children.map(children, child => child)}
        </LayerPanelMenu>
      </ActionsContainer>
    )
  }
}

LayerPanelActions.propTypes = {
  /** An bject with key/value pairs for translated strings */
  translations: PropTypes.object,

  /** An array of components to be displayed inside `LayerPanelMenu` (like `@material-ui/core/MenuItems`) */
  children: PropTypes.node,

  /** An icon component for the button to open the `LayerPanelMenu` (like `@material-ui/icons`) */
  icon: PropTypes.node
}

export default LayerPanelActions
