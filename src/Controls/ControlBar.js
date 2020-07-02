import React from 'react'
import PropTypes from 'prop-types'

import { ControlBarContainer, IconWrapper } from './styled'
import { connectToMap } from 'Map'

import ZoomIn from './ZoomIn'
import ZoomOut from './ZoomOut'
import CurrentLocation from './CurrentLocation'

/**
 * A map control container with built-in positioning
 * @component
 * @category Controls
 * @since NEXT
 */
function ControlBar (props) {
  const { children, map, orientation } = props
  const controlChildren = children ? React.Children.toArray(children) : [
    <CurrentLocation key={'currentLocation'} map={map} />,
    <ZoomIn key={'zoomIn'} map={map} />,
    <ZoomOut key={'zoomOut'} map={map} />
  ]

  // this adds a separator between each controls
  // this .map() is safe b/c of the toArray(children) call above
  const separatedControls = controlChildren.map((c, i) => <IconWrapper key={i}>{c}</IconWrapper>)

  return (
    <ControlBarContainer orientation={orientation}>
      {separatedControls}
    </ControlBarContainer>
  )
}

ControlBar.defaultProps = {
  orientation: 'vertical'
}

ControlBar.propTypes = {
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

export default connectToMap(ControlBar)
