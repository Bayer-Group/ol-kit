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

ZoomIn.defaultProps = {}

ZoomIn.propTypes = {
  /** reference to Openlayers map object */
  map: PropTypes.object.isRequired
}

export default connectToContext(ZoomIn)
