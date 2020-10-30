import React from 'react'
import PropTypes from 'prop-types'

import AddIcon from '@material-ui/icons/Add'
import ControlGroupButton from './ControlGroupButton'
import { zoomDelta, replaceZoomBoxCSS } from './utils'
import { connectToContext } from 'Provider'

/**
 * A simple map zoom in control
 * @component
 * @category Controls
 * @since 0.14.0
 */
function ZoomIn (props) {
  const { map, injectZoomBoxCSS } = props

  let mouseDownTime

  let mouseDownTimeout

  let repeatTimeout

  const repeatZoom = () => {
    // since this is a repeated zoom we want tiny increments over longs times = slow
    zoomDelta(map, 0.2, 300)
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
      zoomDelta(map, 0.5, 150)
      clearTimeout(mouseDownTimeout)
    }
    clearTimeout(repeatTimeout)
  }

  if (injectZoomBoxCSS) replaceZoomBoxCSS()

  return (
    <ControlGroupButton
      id='_ol_kit_zoom_in'
      data-testid='_ol_kit_zoom_in'
      icon={<AddIcon />}
      onMouseDown={() => handleMouseDown()}
      onMouseUp={() => stopZoom()} />
  )
}

ZoomIn.defaultProps = {
  injectZoomBoxCSS: true
}

ZoomIn.propTypes = {
  /** reference to Openlayers map object */
  map: PropTypes.object.isRequired,

  /** injects a CSS style so the Openlayers zoom box is styled correctly */
  injectZoomBoxCSS: PropTypes.bool
}

export default connectToContext(ZoomIn)
