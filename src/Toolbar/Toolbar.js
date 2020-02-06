import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { Container } from './styled'

class Toolbar extends React.Component {
  render () {
    const { children } = this.props

    return ReactDOM.createPortal(
      <Container>
        {children}
      </Container>,
      document.body
    )
  }
}

Toolbar.propTypes = {
  /** The content of the toolbar */
  children: PropTypes.node.isRequired
}

export default Toolbar
