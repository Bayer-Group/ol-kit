import React from 'react'
import PropTypes from 'prop-types'

import ControlGroupButton from './ControlGroupButton'
import GpsFixedIcon from '@material-ui/icons/GpsFixed'
import { connectToMap, centerAndZoom } from 'Map'

/**
 * A simple map zoom control
 * @component
 * @category Controls
 * @since 0.14.0
 */
class CurrentLocation extends React.Component {
  gotoCurrentLocation = () => {
    const { map } = this.props

    navigator?.geolocation?.getCurrentPosition((position) => {
      const opts = {
        x: position.coords.longitude,
        y: position.coords.latitude,
        zoom: 13,
        showPointIcon: true
      }

      centerAndZoom(map, opts)
    })
  }

  render () {
    return (
      <ControlGroupButton
        onClick={this.gotoCurrentLocation}
        data-testid='_ol_kit_current_location'>
        <GpsFixedIcon style={{ fontSize: '1.2rem' }} />
      </ControlGroupButton>
    )
  }
}

CurrentLocation.propTypes = {
  /** reference to Openlayers map object */
  map: PropTypes.object.isRequired
}

export default connectToMap(CurrentLocation)
