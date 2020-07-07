import React from 'react'
import PropTypes from 'prop-types'

import AddIcon from '@material-ui/icons/Add'
import IconButton from '@material-ui/core/IconButton'
import { zoomDelta } from './utils'
import { connectToMap } from 'Map'; // eslint-disable-line

/**
 * A simple map zoom in control
 * @component
 * @category Controls
 * @since NEXT
 */
function ZoomIn (props) {
  const { map } = props
  const view = map.getView()

  let mouseDownTime

  let mouseDownTimeout

  let repeatTimeout

  const repeatZoom = () => {
    zoomDelta(map, 0.5, 50)
    repeatTimeout = setTimeout(() => repeatZoom(), 100)
  }

  const handleMouseDown = () => {
    mouseDownTime = Date.now()
    zoomDelta(map, 0.5, 50)
    mouseDownTimeout = setTimeout(() => {
      repeatZoom()
    }, 200)
  }

  const stopZoom = () => {
    if (Date.now() - mouseDownTime < 150) {
      zoomDelta(map, 0.5, 350)
      clearTimeout(mouseDownTimeout)
    }
    clearTimeout(repeatTimeout)
  }

  return (
    <IconButton
      id='_ol_kit_zoom_in'
      onClick={() => view.animate({ zoom: view.getZoom() + 1, duration: 200 })}
      onMouseDown={() => handleMouseDown()}
      onMouseUp={() => stopZoom()}>
      <AddIcon />
    </IconButton>
  )
}

ZoomIn.propTypes = {
  /** reference to Openlayers map object */
  map: PropTypes.object.isRequired
}

export default connectToMap(ZoomIn)
