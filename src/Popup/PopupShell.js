import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Container, ArrowBox } from './styled'

/**
 * @component
 * @category Popup
 * @since 0.1.0
 */
class PopupShell extends Component {
  render () {
    const { show, width, height, inline, pixel, children, arrow } = this.props
    const arrowTranslator = {
      top: 'bottom',
      bottom: 'top',
      left: 'right',
      right: 'left'
    }

    return (
      <Container width={width} height={height} show={show} inline={inline} pixel={pixel} arrow={arrow}>
        <ArrowBox position={arrowTranslator[arrow]}>
          {children}
        </ArrowBox>
      </Container>
    )
  }
}

PopupShell.defaultProps = {
  arrow: 'none',
  height: 280,
  inline: false,
  pixel: [0, 0],
  show: false,
  width: 280
}

PopupShell.propTypes = {
  /** The position of the popup's arrow (`top`, `right`, `bottom`, `left` or `none`) */
  arrow: PropTypes.string,
  /** The content of the popup */
  children: PropTypes.node,
  /** The height of the popup */
  height: PropTypes.number,
  /** Render the component inline (without absolute positioning) */
  inline: PropTypes.bool,
  /** The pixel coordinate where the popup should render */
  pixel: PropTypes.array,
  /** Show/hide the popup */
  show: PropTypes.bool,
  /** The width of the popup */
  width: PropTypes.number
}

export default PopupShell
