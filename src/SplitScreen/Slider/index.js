import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import Draggable from 'react-draggable'
import { DragBar } from './styled'
import DragBarIcon from './svgIcons/DragBarIcon'

const Slider = ({ initialPosition, onDrag, innerRef }) => {
  const limit = window.innerWidth * 0.2
  const leftBound = (window.innerWidth - limit - (window.innerWidth - initialPosition)) * -1
  const rightBound = window.innerWidth - initialPosition - limit

  return (
    ReactDOM.createPortal(
      <Draggable axis={'x'} bounds={{ left: leftBound, right: rightBound }} onDrag={onDrag}>
        <DragBar position={initialPosition} yOffset={55} ref={innerRef}>
          <DragBarIcon color={'lightgray'} />
        </DragBar>
      </Draggable>,
      document.body
    )
  )
}

Slider.propTypes = {
  /** render slider in a specific position */
  initialPosition: PropTypes.number,

  /** Callback that get's fired when the slider is dragged */
  onDrag: PropTypes.func,

  /** A reference to the inner DOM node */
  innerRef: PropTypes.func
}

export default Slider
