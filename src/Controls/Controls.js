import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import { ControlsContainer } from './styled'
import Compass from './Compass'
import { connectToMap } from 'Map'
import ZoomControls from './ZoomControls'

/**
 * A map control container with built-in positioning
 * @component
 * @category Controls
 * @since 0.1.0
 */
function Controls (props) {
  const { children, map, position, logoPosition } = props

  console.log(props)

  return (
    ReactDOM.createPortal(
      <ControlsContainer position={position} logoPosition={logoPosition}>
        {children || (
          <>
            <ZoomControls map={map} />
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
  logoPosition: 'right'
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
  /** place the ol-kit logo on the 'left', 'right', or set to 'none' to hide */
  logoPosition: PropTypes.string
}

export default connectToMap(Controls)
