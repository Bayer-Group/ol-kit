import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import { Container, ActionIcon, Flyout, Title } from './styled'

/**
 * @component
 * @category Popup
 * @example ./example.md
 */
class PopupActionGroup extends Component {
  constructor (props) {
    super(props)

    this.state = {
      showFlyout: false
    }
  }

  onHover (hover) {
    this.setState({ showFlyout: hover })
  }

  render () {
    const { title, children } = this.props
    const { right, top } = this.el ? this.el.getBoundingClientRect() : { right: 0, top: 0 }

    return (
      <div style={{ position: 'relative' }} ref={(element) => { this.el = element }}>
        <Container onMouseEnter={() => this.onHover(true)}
          onMouseLeave={() => this.onHover(false)}
          hover={this.state.showFlyout}>
          <Title>{title}</Title>
          <ActionIcon>
            <i className='zmdi zmdi-caret-right'></i>
          </ActionIcon>
        </Container>
        {this.state.showFlyout &&
          ReactDOM.createPortal(
            <Flyout left={right} top={top} showFlyout={this.state.showFlyout}
              onMouseEnter={() => this.onHover(true)}
              onMouseLeave={() => this.onHover(false)} >
              {children}
            </Flyout>,
            document.body)
        }
      </div>
    )
  }
}

PopupActionGroup.propTypes = {
  /** An array of items rendered as a flyout */
  children: PropTypes.node.isRequired,

  /** Title of the action group to display on the root level */
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired
}

export default PopupActionGroup
