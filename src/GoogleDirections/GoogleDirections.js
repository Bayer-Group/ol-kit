import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { connectToContext } from 'Provider'
import { Draw, DrawPin } from '../Draw'
import { VectorLayer } from '../classes'
import olSourceVector from 'ol/source/Vector'
import olFormatPolyline from 'ol/format/Polyline'
import { toLonLat } from 'ol/proj'
import olGeomLineString from 'ol/geom/LineString'
import { startPin, endPin, waypointPin, routeStyle } from './utils'

const getDirections = async (locations, apiKey) => {
  const waypoints = locations
  const origin = waypoints.shift().reverse()
  const destination = waypoints.pop().reverse()

  return fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&waypoints=${waypoints.map(c => c.reverse()).toString()}&key=${apiKey}`)
    .then(response => response.json())
    .then(json => {
      if (json.status === 'ZERO_RESULTS') {
        throw new Error('No valid route found')
      } else if (json.status === 'REQUEST_DENIED') {
        throw new Error('The provided API key is invalid')
      } else {
        const route = json.routes?.[0].overview_polyline?.points
        const format = new olFormatPolyline()
        const feature = format.readFeature(route, { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' })

        return feature
      }
    })
}

function GoogleDirections (props) {
  const { map, apiKey } = props
  const [coords, setCoords] = useState([])

  const geometryFunctionCalback = useCallback(
    (coordinates, geometry) => {
      if (!geometry) return new olGeomLineString(coordinates)
      geometry.setCoordinates(coordinates)
      setCoords(coordinates)

      return geometry
    }
  )

  const onDrawBegin = (feature) => {
    feature.setStyle([waypointPin, startPin, endPin])
  }
  const onDrawFinish = async (feature) => {
    const waypoints = feature.getGeometry().getCoordinates().map(coord => toLonLat(coord))
    const route = await getDirections(waypoints, apiKey)

    return new VectorLayer({
      title: 'Google Directions',
      source: new olSourceVector({
        features: [route]
      }),
      style: [startPin, endPin, routeStyle],
      map
    })
  }

  return (
    <>
      <Draw
        onDrawFinish={onDrawFinish}
        onDrawBegin={onDrawBegin}
        onInteractionAdded={() => {}}
        drawOpts={{ geometryFunction: geometryFunctionCalback, style: [waypointPin, startPin, endPin] }}
      >
        <DrawPin type={'LineString'} />
      </Draw>
      <div>
        {!coords.length ? 'Place a point at your origin' : 'Now place a point to add a destination and click finish when you\'re done'}
      </div>
    </>
  )
}

GoogleDirections.propTypes = {
  /** reference to Openlayers map object */
  map: PropTypes.object.isRequired,
  /* Note that you will need to create an account with Google and get an API key. Be sure to turn on all location based permissions.
  You can find instructions on how to do that here https://developers.google.com/places/web-service/intro */
  apiKey: PropTypes.string.isRequired
}

export default connectToContext(GoogleDirections)
