import React from 'react'
import PropTypes from 'prop-types'

import MINUS from 'images/zoom_out_ico.svg'
import PLUS from 'images/zoom_in_ico.svg'
import { Icon, IconSeparator } from './styled'
import { zoomDelta } from './utils'
import { connectToMap } from 'Map'

function ZoomControls (props) {
  const { map } = props
  let mouseUp
  let mouseDown
  let mouseDownTimeout
  let repeatTimeout
  const zoom = direction => {
    const delta = direction === 'ZOOM_IN' ? 0.1 : -0.1

    zoomDelta(map, delta, 350)
  }
  const repeatZoom = direction => {
    zoom(direction)
    repeatTimeout = setTimeout(() => repeatZoom(direction), 350)
  }
  const handleMouseDown = direction => {
    zoom(direction)
    setTimeout(() => {
      repeatZoom(direction)
    }, 200)
  }
  const stopZoom = direction => {
    this.mouseUp = Date.now()
    if (this.mouseUp - this.mouseDown < 150) {
      if (zoomDirection === ZOOM_IN) {
        zoomDelta(this.props.map, 1)
        Logger.metric('zoomIn')
      } else {
        zoomDelta(this.props.map, -1)
        Logger.metric('zoomOut')
      }
      clearTimeout(this.mouseDownTimeout)
    }

    clearTimeout(this.timeout)
  }

  return (
    <>
      <Icon onClick={() => zoom('ZOOM_IN')}>
        <PLUS />
      </Icon>
      <IconSeparator />
      <Icon onClick={() => zoom('ZOOM_OUT')}>
        <MINUS />
      </Icon>
    </>
  )
}

ZoomControls.propTypes = {
  /** reference to Openlayers map object */
  map: PropTypes.object.isRequired
}

export default connectToMap(ZoomControls)
