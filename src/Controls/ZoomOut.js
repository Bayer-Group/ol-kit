import React from 'react'
import PropTypes from 'prop-types'

import RemoveIcon from '@material-ui/icons/Remove'
import ControlGroupButton from './ControlGroupButton'
import { zoomDelta } from './utils'
import { connectToContext } from 'Provider'

/**
 * A simple map zoom out control
 * @component
 * @category Controls
 * @since 0.14.0
 */
function ZoomOut (props) {
  const { map } = props

  let mouseDownTime

  let mouseDownTimeout

  let repeatTimeout

  const repeatZoom = () => {
    const { holdDecrement } = props

    zoomDelta(map, holdDecrement, 300)
    repeatTimeout = setTimeout(() => repeatZoom(), 300)
  }

  const handleMouseDown = () => {
    mouseDownTime = Date.now()
    mouseDownTimeout = setTimeout(() => {
      repeatZoom()
    }, 150)
  }

  const stopZoom = () => {
    const { decrement } = props

    if (Date.now() - mouseDownTime < 150) {
      zoomDelta(map, decrement, 150)
      clearTimeout(mouseDownTimeout)
    }
    clearTimeout(repeatTimeout)
  }

  return (
    <ControlGroupButton
      id='_ol_kit_zoom_out'
      data-testid='_ol_kit_zoom_out'
      icon={<RemoveIcon />}
      onMouseOut={() => stopZoom()}
      onMouseUp={() => stopZoom()}
      onMouseDown={() => handleMouseDown()} />
  )
}

ZoomOut.defaultProps = {
  decrement: -0.5,
  holdDecrement: -0.2
}

ZoomOut.propTypes = {
  /** reference to Openlayers map object */
  map: PropTypes.object.isRequired,
  /** delta for the amount of zoom */
  decrement: PropTypes.number,
  /** delta for the amount of zoom when holding down */
  holdDecrement: PropTypes.number
}

export default connectToContext(ZoomOut)
