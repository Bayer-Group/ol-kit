import React from 'react'
import PropTypes from 'prop-types'

import IconButton from '@material-ui/core/IconButton'
import GpsFixedIcon from '@material-ui/icons/GpsFixed'
import { connectToMap, centerAndZoom } from 'Map'

/**
 * A simple map zoom control
 * @component
 * @category Controls
 * @since NEXT
 */
class CurrentLocation extends React.Component {
  gotoCurrentLocation = () => {
    const { map } = this.props

    navigator.geolocation.getCurrentPosition((position) => {
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
      <IconButton onClick={this.gotoCurrentLocation} aria-label='gps'>
        <GpsFixedIcon />
      </IconButton>
    )
  }
}

CurrentLocation.propTypes = {
  /** reference to Openlayers map object */
  map: PropTypes.object.isRequired
}

export default connectToMap(CurrentLocation)
