import React, { Component } from 'react'
import Draggable from 'react-draggable'
import PropTypes from 'prop-types'

class DragContainer extends Component {
  render () {
    return (
      <Draggable
        axis='both'
        bounds='parent'
        handle='.handle'
        onDrag={this.handleDrag}
        onStart={this.onStart}
        onStop={this.onStop}>
        {this.props.children}
      </Draggable>
    )
  }
}

DragContainer.propTypes = {
  onStart: PropTypes.func,
  onStop: PropTypes.func,
  handleDrag: PropTypes.func
}

export default DragContainer