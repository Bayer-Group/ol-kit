import React from 'react'
import PropTypes from 'prop-types'

import AddIcon from '@material-ui/icons/Add'
import ControlGroupButton from './ControlGroupButton'
import { zoomDelta } from './utils'
import { connectToContext } from 'Provider'

/**
 * A simple map zoom in control
 * @component
 * @category Controls
 * @since 0.14.0
 */
function ZoomIn (props) {
  const { map } = props

  let mouseDownTime

  let mouseDownTimeout

  let repeatTimeout

  const repeatZoom = () => {
    const { holdIncrement } = props

    // since this is a repeated zoom we want tiny increments over longs times = slow
    zoomDelta(map, holdIncrement, 300)
    repeatTimeout = setTimeout(() => repeatZoom(), 300)
  }

  const handleMouseDown = () => {
    mouseDownTime = Date.now()
    mouseDownTimeout = setTimeout(() => {
      repeatZoom()
    }, 150)
  }

  const stopZoom = () => {
    const { increment } = props

    if (Date.now() - mouseDownTime < 150) {
      zoomDelta(map, increment, 150)
      clearTimeout(mouseDownTimeout)
    }
    clearTimeout(repeatTimeout)
  }

  return (
    <ControlGroupButton
      id='_ol_kit_zoom_in'
      data-testid='_ol_kit_zoom_in'
      icon={<AddIcon />}
      onMouseOut={() => stopZoom()}
      onMouseUp={() => stopZoom()}
      onMouseDown={() => handleMouseDown()} />
  )
}

ZoomIn.defaultProps = {
  increment: 0.5,
  holdIncrement: 0.2
}

ZoomIn.propTypes = {
  /** reference to Openlayers map object */
  map: PropTypes.object.isRequired,
  /** delta for the amount of zoom */
  increment: PropTypes.number,
  /** delta for the amount of zoom when holding down */
  holdIncrement: PropTypes.number
}

export default connectToContext(ZoomIn)
