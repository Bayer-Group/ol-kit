import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { connectToContext } from 'Provider'
import { Draw, DrawPin, getVertices, pointsFromVertices } from '../Draw'
import { VectorLayer } from '../classes'
import olSourceVector from 'ol/source/Vector'
import olStyleFill from 'ol/style/Fill'
import olStyleStroke from 'ol/style/Stroke'
import olStyle from 'ol/style/Style'
import olStyleCircle from 'ol/style/Circle'
import olFormatPolyline from 'ol/format/Polyline'
import { toLonLat } from 'ol/proj'
import olGeomPoint from 'ol/geom/Point'
import olGeomLineString from 'ol/geom/LineString'
import olStyleIcon from 'ol/style/Icon'
import tinycolor from 'tinycolor2'

const mapPin = '<path d="M3 0c-1.66 0-3 1.34-3 3 0 2 3 5 3 5s3-3 3-5c0-1.66-1.34-3-3-3zm0 1c1.11 0 2 .9 2 2 0 1.11-.89 2-2 2-1.1 0-2-.89-2-2 0-1.1.9-2 2-2z" transform="translate(1)" />'

function getSVGWrapper (svg, opts) {
  const path = svg.path || svg
  const viewBox = svg.viewBox || '0 0 8 8'
  const {
    stroke = {
      color: '',
      width: '',
      opacity: 1
    },
    fill = '#e82f1c',
    size = {
      width: 8,
      height: 8
    }
  } = opts

  // Chrome 72+ doesn't allow hex fill colors for SVG -- we ensure fills & strokes are always RGB
  return `<svg xmlns="http://www.w3.org/2000/svg" fill="${tinycolor(fill).toRgbString()}" stroke="${stroke.color ? tinycolor(stroke.color).toRgbString() : ''}" stroke-width="${stroke.width}" stroke-opacity="${stroke.opacity}" width="${size.width}" height="${size.height}" viewBox="${viewBox}" preserveAspectRatio="none">${path}</svg>`
}

function getSVGUri (path, opts = {}) {
  return window.encodeURI(getSVGWrapper(path, opts))
}

const fill = new olStyleFill({
  color: 'rgba(255,255,255,0.4)'
})
const stroke = new olStyleStroke({
  color: '#3399CC',
  width: 3.5
})
const routeStyle = new olStyle({
  image: new olStyleCircle({
    fill,
    stroke,
    radius: 5
  }),
  fill,
  stroke
})
const waypointPin = new olStyle({
  image: new olStyleCircle({
    fill,
    stroke: stroke,
    radius: 5
  }),
  geometry: getVertices
})

const startPin = new olStyle({
  image: new olStyleIcon({
    anchor: [0.5, 0.5],
    opacity: 1,
    src: `data:image/svg+xml;utf8,${getSVGUri(mapPin, { fill: 'green', size: 8 })}`,
    scale: 4
  }),
  geometry: feature => {
    const geom = feature.getGeometry()
    const points = pointsFromVertices(geom)

    return new olGeomPoint(points[0])
  }
})
const endPin = new olStyle({
  image: new olStyleIcon({
    anchor: [0.5, 0.5],
    opacity: 1,
    src: `data:image/svg+xml;utf8,${getSVGUri(mapPin, { fill: 'rgba(255,0,0,1)', size: 8 })}`,
    scale: 4
  }),
  geometry: feature => {
    const points = pointsFromVertices(feature.getGeometry())

    return new olGeomPoint(points[points.length - 1])
  }
})

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
