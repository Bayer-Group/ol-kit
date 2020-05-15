import React from 'react'
import PropTypes from 'prop-types'

import MINUS from 'images/zoom_out_ico.svg'
import PLUS from 'images/zoom_in_ico.svg'
import { Icon, IconSeparator, IconsContainer } from './styled'
import { zoomDelta } from './utils'
import { connectToMap } from 'Map'; // eslint-disable-line

/**
 * A simple map zoom control
 * @component
 * @category Controls
 * @since 0.1.0
 */
function ZoomControls (props) {
  const { map } = props

  let mouseDownTime

  let mouseDownTimeout

  let repeatTimeout
  const zoom = (direction, duration = 350) => {
    const delta = direction === 'ZOOM_IN' ? 0.1 : -0.1

    zoomDelta(map, delta, duration)
  }
  const repeatZoom = direction => {
    zoom(direction)
    repeatTimeout = setTimeout(() => repeatZoom(direction), 350)
  }
  const handleMouseDown = direction => {
    mouseDownTime = Date.now()
    zoom(direction)
    mouseDownTimeout = setTimeout(() => {
      repeatZoom(direction)
    }, 200)
  }
  const stopZoom = direction => {
    if (Date.now() - mouseDownTime < 150) {
      zoom(direction)
      clearTimeout(mouseDownTimeout)
    }
    clearTimeout(repeatTimeout)
  }

  return (
    <IconsContainer>
      <Icon
        id='_ol_kit_zoom_in'
        onMouseDown={() => handleMouseDown('ZOOM_IN')}
        onMouseUp={() => stopZoom('ZOOM_IN')}
        onClick={() => zoom('ZOOM_IN', 50)}>
        <PLUS />
      </Icon>
      <IconSeparator />
      <Icon
        id='_ol_kit_zoom_out'
        onMouseDown={() => handleMouseDown('ZOOM_OUT')}
        onMouseUp={() => stopZoom('ZOOM_OUT')}
        onClick={() => zoom('ZOOM_IN', 50)}>
        <MINUS />
      </Icon>
    </IconsContainer>
  )
}

ZoomControls.propTypes = {
  /** reference to Openlayers map object */
  map: PropTypes.object.isRequired
}

export default connectToMap(ZoomControls)
