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
  /** A string for the LayerPanelHeader title */
  title: PropTypes.string,
  /** array or component to render in the LayerPanelMenu */
  actions: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.node
  ]),
  /** component to render on the left side of the title */
  avatar: PropTypes.node
}

LayerPanelHeader.defaultProps = {
  defaultActions: false,
  masterCheckbox: false,
  hideActions: false
}

export default LayerPanelHeader
