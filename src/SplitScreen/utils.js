import { fromCircle } from 'ol/geom/Polygon'
import * as olProj from 'ol/proj'

import turfDistance from '@turf/distance'
import turfBearing from '@turf/bearing'
import turfDestination from '@turf/destination'

const defaultDataProjection = 'EPSG:4326'

export default function turf (turfFunc, argArray, projection = 'EPSG:3857') {
  const transformedArgs = argArray.map((arg) => {
    return transform(arg, projection, true)
  })
  const turfResults = turfFunc.apply(this, transformedArgs)

  return transform(turfResults, projection, false)
}

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
      return optCircle ? geometry.getCenter() : fromCircle(geometry).getCoordinates()
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

export function refreshMapSizeCSS (mapCount, sliderPosition) {
  const map0 = document.getElementById('map0') || {} // these empty objects solve a 'cannot set style of null' error
  const map1 = document.getElementById('map1') || {}
  const map2 = document.getElementById('map2') || {}
  const map3 = document.getElementById('map3') || {}

  if (mapCount === 1) {
    map0.style = 'position: relative; width: 100%;'
    map1.style = map2.style = map3.style = ''
  } else if (mapCount === 2) {
    const limit = window.innerWidth * 0.2
    const { right: map0Right } = map0.getBoundingClientRect()
    const defaultWidth = 10
    const defaultX = map0Right === window.innerWidth ? window.innerWidth / 2 : map0Right - (defaultWidth / 2)
    const { x, width } = sliderPosition || { x: defaultX, width: defaultWidth }
    // Find the largest value from the smallest value between the x position and the width adjusted for the limit and the limit.  This gives us either the position of the slider, the maximum limit, or the minimum limit.
    const position = Math.max(Math.min(x, window.innerWidth - limit), limit)
    const right = window.innerWidth - (position + (width / 2))
    const left = position + width / 2

    map0.style = `position: absolute; height: ${window.innerHeight - 55}px; width: auto; left: 0px; right: ${right}px;`
    map1.style = `position: absolute; height: ${window.innerHeight - 55}px; width: auto; left: ${left}px; right: 0px; outline: white 2px dashed; box-shadow: 0px 0px 0px 2px #297fb9;`
    map2.style = map3.style = 'display: none;'
  } else if (mapCount === 3) {
    map0.style = 'position: relative; width: 100%; height: 50%; float: left;'
    map1.style = 'position: relative; width: 50%; height: 50%; float: left; margin-top: 0px; outline: white 2px dashed; box-shadow: 0px 0px 0px 2px #297fb9;'
    map2.style = 'position: relative; width: 50%; height: 50%; float: left; outline: white 2px dashed; box-shadow: 0px 0px 0px 2px #297fb9;'
    map3.style = ''
  } else {
    map0.style = 'position: relative; width: 50%; height: 50%; float: left;'
    map1.style = 'position: relative; width: 50%; height: 50%; float: left; outline: white 2px dashed; box-shadow: 0px 0px 0px 2px #297fb9;'
    map3.style = 'position: relative; width: 50%; height: 50%; float: left; outline: white 2px dashed; box-shadow: 0px 0px 0px 2px #297fb9;'
  }
}

export function bindSplitScreenMapChanges (maps, callback) {
  maps.map(map => {
    map.map.on('visible', () => callback(maps))
    map.map.on('hidden', () => callback(maps))
    map.map.on('synced', () => callback(maps))
    map.map.on('unsynced', () => callback(maps))
  })
}

export function unbindSplitScreenMapChanges (maps, callback) {
  maps.map(map => {
    map.map.un('visible', () => callback(maps))
    map.map.un('hidden', () => callback(maps))
    map.map.un('synced', () => callback(maps))
    map.map.un('unsynced', () => callback(maps))
  })
}
