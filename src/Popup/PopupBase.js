import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Draggable from 'react-draggable'

import DragHandle from './DragHandle'
import { ArrowBox, Container } from './styled'

/**
 * @component
 * @category Popup
 * @since 0.2.0
 */
class PopupBase extends Component {
  state = {
    dragged: false,
    pinnedPixel: this.props.pixel,
    transparent: false
  }

  onStart = () => {
    const { arrow, onPopupDragStart, pixel, transparentDuringDrag } = this.props
    // this hard sets the arrow direction at the time of initial drag
    const lastArrow = !this.state.dragged ? arrow : this.state.lastArrow
    const pinnedPixel = !this.state.dragged ? pixel : this.state.pinnedPixel

    this.setState({
      dragged: true,
      lastArrow,
      pinnedPixel,
      transparent: transparentDuringDrag
    })
    onPopupDragStart()
  }

  onStop = e => {
    this.setState({
      transparent: false
    })
    this.props.onPopupDragEnd(e)
  }

  handleDrag = e => {
    this.props.onPopupDrag(e)
  }

  render () {
    const { arrow: arrowProp, children, draggable, height, inline, pixel: pixelProp, show, width } = this.props
    const { dragged, lastArrow, pinnedPixel, transparent } = this.state
    const arrowTranslator = {
      top: 'bottom',
      bottom: 'top',
      left: 'right',
      right: 'left',
      none: 'none'
    }
    const pixel = dragged ? pinnedPixel : pixelProp
    const arrow = dragged ? lastArrow : arrowProp

    return (
      <Draggable
        axis='both'
        bounds='parent'
        handle='.handle'
        onDrag={this.handleDrag}
        onStart={this.onStart}
        onStop={this.onStop}>
        <Container
          arrow={arrow}
          height={height}
          inline={inline}
          pixel={pixel}
          show={show}
          transparent={transparent}
          width={width}>
          {draggable ? <DragHandle /> : null}
          <ArrowBox hide={dragged} position={arrowTranslator[arrow]} />
          {children}
        </Container>
      </Draggable>
    )
  }
}

PopupBase.defaultProps = {
  arrow: 'none',
  draggable: true,
  height: 280,
  inline: false,
  onPopupDrag: () => {},
  onPopupDragEnd: () => {},
  onPopupDragStart: () => {},
  pixel: [0, 0],
  show: false,
  transparentDuringDrag: true,
  width: 280
}

PopupBase.propTypes = {
  /** The position of the popup's arrow (`top`, `right`, `bottom`, `left` or `none`) */
  arrow: PropTypes.string,
  /** The content of the popup */
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  draggable: PropTypes.bool,
  /** The height of the popup */
  height: PropTypes.number,
  /** Render the component inline (without absolute positioning) */
  inline: PropTypes.bool,
  /** Callback fired during drags when draggable is true */
  onPopupDrag: PropTypes.func,
  /** Callback fired after a drag when draggable is true */
  onPopupDragEnd: PropTypes.func,
  /** Callback fired at the beginning of a drag when draggable is true */
  onPopupDragStart: PropTypes.func,
  /** The pixel coordinate where the popup should render */
  pixel: PropTypes.array,
  /** Show/hide the popup */
  show: PropTypes.bool,
  /** Set PopupBase to see-through during a drag when draggable is true */
  transparentDuringDrag: PropTypes.bool,
  /** The width of the popup */
  width: PropTypes.number
}

export default PopupBase
