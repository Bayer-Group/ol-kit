import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import { ControlsContainer } from './styled'
import ControlGroup from './ControlGroup'
import CurrentLocation from './CurrentLocation'

import ZoomIn from './ZoomIn'
import ZoomOut from './ZoomOut'
import Compass from './Compass'
import ScaleLine from './ScaleLine'
import { connectToContext } from 'Provider'

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
            <ScaleLine map={map} orientation={orientation}/>
            <ControlGroup map={map} orientation={orientation}>
              <CurrentLocation map={map} />
              <ZoomIn map={map} />
              <ZoomOut map={map} />
            </ControlGroup>
            <Compass map={map} />
          </>
        )}
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

export default connectToContext(Controls)
