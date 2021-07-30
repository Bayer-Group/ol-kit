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

  onHover (hover, delay = false) {
    if (delay) {
      // allow a slight delay to account for mousing over scroll bars
      // when moving to flyout on certain browsers/OS
      this.timeout = setTimeout(() => this.setState({ showFlyout: hover }), 50)
    } else {
      if (this.timeout) {
        // clear the timeout if mouse enters the flyout before timeout fires
        clearTimeout(this.timeout)
        this.timeout = null
      }
      this.setState({ showFlyout: hover })
    }
  }

  render () {
    const { title, children, feature } = this.props
    const { right, top } = this.el ? this.el.getBoundingClientRect() : { right: 0, top: 0 }
    const transformedChildren = React.Children.map(children, c => {
      return React.cloneElement(c, { ...(feature && { feature }) })
    })

    return (
      <div style={{ position: 'relative' }} ref={(element) => { this.el = element }}>
        <Container onMouseEnter={() => this.onHover(true)}
          onMouseLeave={() => this.onHover(false, true)}
          hover={this.state.showFlyout}>
          <Title>{title}</Title>
          <ActionIcon>
            <i className='zmdi zmdi-caret-right'></i>
          </ActionIcon>
        </Container>
        {this.state.showFlyout &&
          ReactDOM.createPortal(
            <Flyout
              left={right}
              top={top}
              showFlyout={this.state.showFlyout}
              onMouseEnter={() => this.onHover(true)}
              onMouseLeave={() => this.onHover(false)}>
              {transformedChildren}
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
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  
  /** Openlayers feature currently shown in popup */
  feature: PropTypes.object
}

export default PopupActionGroup
