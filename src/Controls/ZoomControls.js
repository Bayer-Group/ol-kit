import React from 'react'
import PropTypes from 'prop-types'

import ZoomIn from './ZoomIn'
import ZoomOut from './ZoomOut'
import ControlGroup from './ControlGroup'
import { replaceZoomBoxCSS } from './utils'
import { connectToContext } from 'Provider'; // eslint-disable-line

/**
 * A map control group with zoom in and zoom out buttons
 * @component
 * @category Controls
 * @since 0.1.0
 */
function ZoomControls (props) {
  const { orientation } = props

  replaceZoomBoxCSS()

  return (
    <ControlGroup orientation={orientation}>
      <ZoomIn injectZoomBoxCSS={false} />
      <ZoomOut injectZoomBoxCSS={false} />
    </ControlGroup>
  )
}

ZoomControls.propTypes = {
  /** reference to Openlayers map object */
  map: PropTypes.object.isRequired,

  /** the orientation of the zoom controls */
  orientation: PropTypes.oneOf(['vertical', 'horizontal'])
}

export default connectToContext(ZoomControls)
