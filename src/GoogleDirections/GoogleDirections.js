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
import { Container } from './styled'

const getDirections = async (locations, apiKey) => {
  const waypoints = locations
  const origin = waypoints.shift().reverse()
  const destination = waypoints.pop().reverse()
  const formatedWaypoints = waypoints.map(c => c.reverse()).join('|')

  return fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&waypoints=${formatedWaypoints}&key=${apiKey}`)
    .then(response => response.json())
    .then(json => {
      if (json.status === 'ZERO_RESULTS') {
        throw new Error('No valid route found')
      } else if (json.status === 'REQUEST_DENIED') {
        throw new Error('The provided API key is invalid')
      } else {
        const route = json.routes?.[0]?.overview_polyline?.points
        const format = new olFormatPolyline()
        const routeFeature = format.readFeature(route, { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' })

        routeFeature.setProperties(json.routes?.[0])
        routeFeature.set('title', json.routes?.[0].summary)

        return routeFeature
      }
    })
}

export function getStepFeatures (feature) {
  const legs = feature.getProperties().legs
  const steps = legs.map(leg => leg.steps).flat()
  const format = new olFormatPolyline()

  return steps.map((step, i) => {
    const stepRoute = step?.polyline?.points
    const feature = format.readFeature(stepRoute, { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' })

    const formatedProps = { ...step }

    for (const prop in step) {
      const val = step[prop]

      if (val?.text) formatedProps[prop] = val.text
    }
    feature.setProperties(formatedProps)
    feature.set('title', `Step ${i}`)

    return feature
  })
}

/**
 * A button for drawing two pin points for Google Directions.
 * @component
 * @category GoogleDirections
 * @since 1.8.0
 */
function GoogleDirections (props) {
  const { map, apiKey, translations } = props
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
    setCoords([])
    feature.setStyle([waypointPin, startPin, endPin])
  }
  const onDrawFinish = async (feature) => {
    const waypoints = feature.getGeometry().getCoordinates().map(coord => toLonLat(coord))
    const route = await getDirections(waypoints, apiKey)

    const routeLayer = new VectorLayer({
      title: 'Google Directions - Overview',
      source: new olSourceVector({
        features: [route]
      }),
      style: [startPin, endPin, routeStyle]
    })
    const stepLayer = new VectorLayer({
      title: 'Google Directions - Step by Step',
      source: new olSourceVector({
        features: getStepFeatures(route)
      }),
      style: [routeStyle]
    })

    map.addLayer(routeLayer)
    map.addLayer(stepLayer)
    setCoords([])
  }

  return (
    <Container>
      <p>
        {!coords.length ? translations['_ol_kit.directions.placeOriginPoint'] : translations['_ol_kit.directions.placeWaypoint']}
      </p>
      <Draw
        onDrawFinish={onDrawFinish}
        onDrawBegin={onDrawBegin}
        onDrawCancel={() => setCoords([])}
        drawOpts={{ geometryFunction: geometryFunctionCalback, style: [waypointPin, startPin, endPin] }}
      >
        <DrawPin type={'LineString'} tooltipTitle={translations['_ol_kit.directions.waypointLabel']} />
      </Draw>
    </Container>
  )
}

GoogleDirections.propTypes = {
  /** reference to Openlayers map object */
  map: PropTypes.object.isRequired,
  /* Note that you will need to create an account with Google and get an API key. Be sure to turn on all location based permissions.
  You can find instructions on how to do that here https://developers.google.com/places/web-service/intro */
  apiKey: PropTypes.string.isRequired,
  /** translations object */
  translations: PropTypes.object
}

export default connectToContext(GoogleDirections)
