import React from 'react'
import PropTypes from 'prop-types'

import AddIcon from '@material-ui/icons/Add'
import IconButton from '@material-ui/core/IconButton'
import { zoomDelta } from './utils'
import { connectToMap } from 'Map'; // eslint-disable-line

/**
 * A simple map zoom control
 * @component
 * @category Controls
 * @since 0.1.0
 */
function ZoomIn (props) {
  const { map } = props
  const view = map.getView()

  let mouseDownTime

  let mouseDownTimeout

  let repeatTimeout

  const zoom = direction => {
    const delta = direction === 'ZOOM_IN' ? 0.5 : -0.5

    zoomDelta(map, delta, 50)
  }
  const repeatZoom = direction => {
    zoom(direction)
    repeatTimeout = setTimeout(() => repeatZoom(direction), 100)
  }
  const handleMouseDown = direction => {
    mouseDownTime = Date.now()
    zoom(direction)
    mouseDownTimeout = setTimeout(() => {
      repeatZoom(direction)
    }, 200)
  }

  return (
    <IconButton
      id='_ol_kit_zoom_in'
      onClick={() => view.animate({ zoom: view.getZoom() + 1, duration: 200 })}
      onMouseDown={() => handleMouseDown('ZOOM_IN')}
      onMouseUp={() => {}}>
      <AddIcon />
    </IconButton>
  )
}

ZoomIn.propTypes = {
  /** reference to Openlayers map object */
  map: PropTypes.object.isRequired
}

export default connectToMap(ZoomIn)
