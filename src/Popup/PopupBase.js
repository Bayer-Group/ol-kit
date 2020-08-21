import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Draggable from 'react-draggable'
import { ArrowBox, Container } from './styled'
import Hand from './Hand'

/**
 * @component
 * @category Popup
 * @since 0.2.0
 */
class PopupBase extends Component {
  state = {
    dragged: false,
    pinnned: false,
    pinnedPixel: [0, 0],
    transparent: false,
    x: 0,
    y: 0
  }

  onStart = () => {
    const { onPopupDragStart, transparentDuringDrag } = this.props

    this.setState({
      dragged: true,
      pinnedPixel: this.props.pixel,
      transparent: transparentDuringDrag
    })
    onPopupDragStart()
  }

  onStop = (e) => {
    this.props.onPopupDragEnd(e)
    this.setState({
      pinnedPixel: this.props.pixel,
      transparent: false
    })
  }

  handleDrag = (e, ui) => {
    this.setState(state => ({
      pinnedPixel: this.props.pixel,
      x: e.x,
      y: e.y
    }))
    this.props.onPopupDrag(e)
  }

  render () {
    const { arrow, show, width, height, inline, pixel: pixelProp, children } = this.props
    const { dragged, pinned, pinnedPixel, transparent } = this.state
    const arrowTranslator = {
      top: 'bottom',
      bottom: 'top',
      left: 'right',
      right: 'left'
    }
    const unsnapped = dragged || pinned
    const pixel = unsnapped ? pinnedPixel : pixelProp

    return (
      <Draggable
        axis='both'
        bounds='parent'
        handle='.handle'
        onStart={this.onStart}
        onStop={this.onStop}
        onDrag={this.handleDrag}>
        <Container
          arrow={arrow}
          height={height}
          inline={inline}
          pixel={pixel}
          show={show}
          transparent={transparent}
          width={width}>
          <Hand />
          <ArrowBox unset={unsnapped} position={arrowTranslator[arrow]}>
          </ArrowBox>
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
  onPopupDrag: PropTypes.func,
  onPopupDragEnd: PropTypes.func,
  onPopupDragStart: PropTypes.func,
  /** The pixel coordinate where the popup should render */
  pixel: PropTypes.array,
  /** Show/hide the popup */
  show: PropTypes.bool,
  transparentDuringDrag: PropTypes.bool,
  /** The width of the popup */
  width: PropTypes.number
}

export default PopupBase
