import turf from './astro'

import olGeomPolygon from 'ol/geom/Polygon'
import * as olProj from 'ol/proj'

import turfDistance from '@turf/distance'
import turfBearing from '@turf/bearing'
import turfDestination from '@turf/destination'

export function coordValidator (coord) {
  return coord.map((val) => {
    return isNaN(val) ? 0 : val || 0
  })
}

export function getCoordinates (geometry, optCircle = false) {
  switch (geometry.getType()) {
    case 'GeometryCollection':
      return geometry.getGeometries().map(geom => getCoordinates(geom, optCircle))
    case 'Circle':
      return optCircle ? geometry.getCenter() : olGeomPolygon.fromCircle(geometry).getCoordinates()
    default:
      try {
        return geometry.getCoordinates()
      } catch (e) {
        return undefined
      }
  }
}

export const getHeading = (coordinate, index, allowNegative = true) => {
  const absCoord = Math.abs(coordinate)
  const coord = allowNegative ? coordinate : absCoord

  if (index === 0 && absCoord <= 180) {
    if (coordinate > 0) {
      return `${coord}˚ E`
    } else {
      return `${coord}˚ W`
    }
  } else if (coordinate > 0 && absCoord) {
    return `${coord}˚ N`
  } else {
    return `${coord}˚ S`
  }
}

export function coordDiff (coord1, coord2, view) {
  const projection = view.getProjection()

  const args = [coordValidator(coord1), coordValidator(coord2)]

  const distance = turf(turfDistance, args, projection)
  const bearing = turf(turfBearing, args, projection)

  return { distance, bearing }
}

export function targetDestination (startCoord, distance, bearing, view) {
  const projection = view.getProjection()

  const coord = olProj.toLonLat(coordValidator(startCoord), projection)
  const destination = turfDestination(coord, distance, bearing)

  return olProj.fromLonLat(destination.geometry.coordinates, projection)
}

export function normalizeExtent (extent) {
  const newExtent = []

  newExtent[0] = extent[1]
  newExtent[1] = extent[0]
  newExtent[2] = extent[3]
  newExtent[3] = extent[2]

  return newExtent.map((coords) => {
    if (coords === 90) {
      return 89.99
    } else if (coords === -90) {
      return -89.99
    } else {
      return coords
    }
  })
}

export function pairCoords (flatCoords) {
  const pairedCoords = []

  for (let i = 0; i < flatCoords.length - 1;) {
    pairedCoords.push([flatCoords[i], flatCoords[i + 1]])
    i += 2
  }

  return pairedCoords
}

export function convertXYtoLatLong (map, x, y) {
  const coords = map.getCoordinateFromPixel([x, y])
  const transformed = olProj.transform(coords, map.getView().getProjection().getCode(), 'EPSG:4326')
  const longitude = Number((Number(transformed[0] || 0) % 180).toFixed(6))
  const latitude = Number((transformed[1] || 0).toFixed(6))

  return {
    longitude,
    latitude
  }
}
