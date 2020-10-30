import React from 'react'
import PropTypes from 'prop-types'

import RemoveIcon from '@material-ui/icons/Remove'
import ControlGroupButton from './ControlGroupButton'
import { zoomDelta, replaceZoomBoxCSS } from './utils'
import { connectToContext } from 'Provider'

/**
 * A simple map zoom out control
 * @component
 * @category Controls
 * @since 0.14.0
 */
function ZoomOut (props) {
  const { map, injectZoomBoxCSS } = props

  let mouseDownTime

  let mouseDownTimeout

  let repeatTimeout

  const repeatZoom = () => {
    zoomDelta(map, -0.2, 300)
    repeatTimeout = setTimeout(() => repeatZoom(), 300)
  }
  const handleMouseDown = () => {
    mouseDownTime = Date.now()
    mouseDownTimeout = setTimeout(() => {
      repeatZoom()
    }, 150)
  }
  const stopZoom = () => {
    if (Date.now() - mouseDownTime < 150) {
      zoomDelta(map, -0.5, 150)
      clearTimeout(mouseDownTimeout)
    }
    clearTimeout(repeatTimeout)
  }

  if (injectZoomBoxCSS) replaceZoomBoxCSS()

  return (
    <ControlGroupButton
      id='_ol_kit_zoom_out'
      data-testid='_ol_kit_zoom_out'
      onMouseUp={() => stopZoom()}
      onMouseDown={() => handleMouseDown()}>
      <RemoveIcon />
    </ControlGroupButton>
  )
}

ZoomOut.propTypes = {
  /** reference to Openlayers map object */
  map: PropTypes.object.isRequired,

  /** injects a CSS style so the Openlayers zoom box is styled correctly */
  injectZoomBoxCSS: PropTypes.bool
}

export default connectToContext(ZoomOut)
