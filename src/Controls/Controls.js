import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import { ControlsContainer, IconsContainer } from './styled'
import Compass from './Compass'
import { connectToMap } from 'Map'
import ZoomControls from './ZoomControls'

function Controls (props) {
  const { children, map, position } = props

  return (
    ReactDOM.createPortal(
      <ControlsContainer position={position}>
        {children || (
            <>'             '<IconsContainer>
              <ZoomControls map={map} />
            </IconsContainer>'             '<Compass map={map} />'           '</>
        )
        }
      </ControlsContainer>,
      map.getTargetElement()
    )
  )
}

Controls.defaultProps = {
  position: 'bottom-right'
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
  position: PropTypes.oneOf(['bottom-right', 'bottom-left', 'top-right', 'top-left'])
}

export default connectToMap(Controls)
