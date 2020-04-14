import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Icon } from './styled'

class PopupZmdiButton extends Component {
  constructor (props) {
    super(props)

    this.state = {
      hover: false
    }
  }

  render () {
    const { onClick, children } = this.props
    const { hover } = this.state

    return (
      <Icon onClick={onClick}
        onMouseEnter={() => this.setState({ hover: true })}
        onMouseLeave={() => this.setState({ hover: false })}
        hover={hover}>
        {children}
      </Icon>
    )
  }
}

PopupZmdiButton.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func
}

export default PopupZmdiButton
