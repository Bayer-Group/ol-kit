import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import { ControlsContainer } from './styled'
import { connectToMap } from 'Map'
import Compass from './Compass'
import ControlBar from './ControlBar'
import HomeIcon from '@material-ui/icons/Home'
import IconButton from '@material-ui/core/IconButton'
import CurrentLocation from './CurrentLocation'

import ZoomIn from './ZoomIn'
import ZoomOut from './ZoomOut'

/**
 * A map control container with built-in positioning
 * @component
 * @category Controls
 * @since 0.1.0
 */
function Controls (props) {
  const { children, map, position, orientation } = props

  return (
    ReactDOM.createPortal(
      <ControlsContainer position={position} orientation={orientation}>
        {children || (
          <>
            <ControlBar orientation={orientation}>
              <IconButton><HomeIcon /></IconButton>
              <CurrentLocation map={map} />
            </ControlBar>
            <ControlBar map={map} orientation={orientation}>
              <ZoomIn map={map} />
              <ZoomOut map={map} />
            </ControlBar>

            <Compass map={map} />
          </>
        )
        }
      </ControlsContainer>,
      map.getTargetElement()
    )
  )
}

Controls.defaultProps = {
  position: 'bottom-right',
  orientation: 'horizontal'
}

Controls.propTypes = {
  /** pass child comps to opt out of the default controls */
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  /** reference to Openlayers map object */
  map: PropTypes.object.isRequired,
  /** render controls in a position relative to the map  */
  position: PropTypes.oneOf(['bottom-right', 'bottom-left', 'top-right', 'top-left']),
  /** render controls in a position relative to the map  */
  orientation: PropTypes.oneOf(['vertical', 'horizontal'])
}

export default connectToMap(Controls)
