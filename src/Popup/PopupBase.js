import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Container, ArrowBox } from './styled'

/**
 * @component
 * @category Popup
 * @since 0.1.0
 */
class PopupBase extends Component {
  render () {
    const { show, width, height, inline, pixel, children, arrow } = this.props
    const arrowTranslator = {
      top: 'bottom',
      bottom: 'top',
      left: 'right',
      right: 'left'
    }

    return (
      <Container width={width} height={height} show={show} inline={inline} pixel={pixel} arrow={arrow} {...this.props}>
        <ArrowBox position={arrowTranslator[arrow]}>
          {children}
        </ArrowBox>
      </Container>
    )
  }
}

PopupBase.defaultProps = {
  arrow: 'none',
  height: 280,
  inline: false,
  pixel: [0, 0],
  show: false,
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

export default PopupBase
