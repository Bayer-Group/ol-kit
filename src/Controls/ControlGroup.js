import React from 'react'
import PropTypes from 'prop-types'

import { ControlGroupContainer } from './styled'
import { connectToContext } from 'Provider'

import ZoomIn from './ZoomIn'
import ZoomOut from './ZoomOut'
import CurrentLocation from './CurrentLocation'

/**
 * A map control container with built-in orientations
 * @component
 * @category Controls
 * @since 0.14.0
 */
function ControlGroup ({ children, map, orientation }) {
  const controlChildren = children || [
    <CurrentLocation key={'currentLocation'} map={map} />,
    <ZoomIn key={'zoomIn'} map={map} />,
    <ZoomOut key={'zoomOut'} map={map} />
  ]

  return (
    <ControlGroupContainer orientation={orientation}>
      {controlChildren}
    </ControlGroupContainer>
  )
}

ControlGroup.defaultProps = {
  orientation: 'vertical'
}

ControlGroup.propTypes = {
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

export default connectToContext(ControlGroup)
