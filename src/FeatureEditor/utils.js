import ugh from 'ugh'
import { radiansToDegrees } from '@turf/helpers'
import turfDestination from '@turf/destination'
import turfDistance from '@turf/distance'
import turfBearing from '@turf/bearing'
import * as turfAssert from '@turf/invariant'

import olGeomPolygon, { fromCircle } from 'ol/geom/Polygon'
import * as olProj from 'ol/proj'

import olFormatGeoJson from 'ol/format/GeoJSON'
import olFeature from 'ol/Feature'
import olCollection from 'ol/Collection'

const defaultDataProjection = 'EPSG:4326'

export function olKitTurf (turfFunc, argArray, projection = 'EPSG:3857') {
  const transformedArgs = argArray.map((arg) => {
    return transform(arg, projection, true)
  })
  const turfResults = turfFunc.apply(this, transformedArgs)

  return transform(turfResults, projection, false)
}

export function transform (value, projection, toWgs84) {
  const { type } = describeType(value)
  const format = new olFormatGeoJson({
    defaultDataProjection,
    featureProjection: projection
  })

  return toWgs84
    ? input(value, projection, type, format)
    : output(value, projection, type, format)
}

export function input (value, projection, type, format) {
  switch (type) {
    case 'coordinate':
      return olProj.toLonLat(value, projection)
    case 'extent':
      return olProj.transformExtent(value, projection, defaultDataProjection)
    case 'olGeometry':
      return format.writeGeometryObject(value)
    case 'olFeature':
      return format.writeFeatureObject(value)
    case 'Array':
      return format.writeFeaturesObject(value)
    case 'olCollection':
      return format.writeFeaturesObject(value.getArray())
    default:
      return value
  }
}

export function output (value, projection, type, format) {
  switch (type) {
    case 'coordinate':
      return olProj.transform(value, 'EPSG:4326', projection)
    case 'extent':
      return olProj.transformExtent(value, defaultDataProjection, projection)
    case 'geojsonGeometry':
      return format.readGeometry(value)
    case 'geojsonFeature':
      return format.readFeature(value)
    case 'Array':
      return value.map(item => {
        const itemType = describeType(item).type

        return output(item, projection, itemType, format)
      })
    case 'geojsonCollection':
      return format.readFeatures(value)
    default:
      return value
  }
}
export function describeType (query) {
  if (Array.isArray(query)) {
    const containsNumber = assertTurf('containsNumber', false, [query])

    if (containsNumber) {
      switch (query.length) {
        case 2:
          assertTurf('containsNumber', false, [query])

          return {
            type: 'coordinate'
          }
        case 4:
          assertTurf('containsNumber', false, [query])

          return {
            type: 'extent'
          }
        default:
          return {
            type: 'Array',
            contains: query.map(val => describeType(val))
          }
      }
    } else {
      return {
        type: 'Array',
        contains: query.map(val => describeType(val))
      }
    }
  } else if (query instanceof olFeature) {
    return {
      type: 'olFeature',
      geomType: query.getGeometry().getType()
    }
  } else if (query.getType) {
    return {
      type: 'olGeometry',
      geomType: query.getType()
    }
  } else if (query instanceof olCollection) {
    return {
      type: 'olCollection',
      contains: query.getArray().map(val => describeType(val))
    }
  } else if (assertTurf('geojsonType', false, query, 'FeatureCollection', 'describeType')) {
    return {
      type: 'geojsonFeatureCollection'
    }
  } else if (assertTurf('geojsonType', false, query, 'Feature', 'describeType')) {
    return {
      type: 'geojsonFeature'
    }
  } else if (assertTurf('geojsonType', false, query, 'Polygon', 'describeType')) {
    return {
      type: 'geojsonGeometry',
      geomType: 'Polygon'
    }
  } else if (assertTurf('geojsonType', false, query, 'LineString', 'describeType')) {
    return {
      type: 'geojsonGeometry',
      geomType: 'LineString'
    }
  } else if (assertTurf('geojsonType', false, query, 'Point', 'describeType')) {
    return {
      type: 'geojsonGeometry',
      geomType: 'Point'
    }
  } else {
    return {
      type: typeof query
    }
  }
}

export function assertTurf (assertion, hard, ...args) {
  try {
    turfAssert[assertion].apply(null, args)
  } catch (error) {
    if (hard) {
      throw new Error(error.message)
    } else {
      return false
    }
  }

  return true
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

  const distance = olKitTurf(turfDistance, args, projection)
  const bearing = olKitTurf(turfBearing, args, projection)

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

export function pairCoordinates (flatCoords) {
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

export function createNewBoxGeom (map, geometry, height, width) {
  const coords = geometry.getCoordinates()
  const topLeft = map.getPixelFromCoordinate(coords)

  // TODO: ensure this never gets called before the map is loaded
  // if this util is called before the map is loaded it's likely possible to get a null value
  if (topLeft) {
    const moveRight = topLeft[0] + 400 // TODO: change this when we make the width the right dimension again
    const moveDown = topLeft[1] + height
    const pixelShape = [
      topLeft,
      [moveRight, topLeft[1]],
      [moveRight, moveDown],
      [topLeft[0], moveDown],
      topLeft
    ]

    return new olGeomPolygon([pixelShape.map(pixel => map.getCoordinateFromPixel(pixel))])
    // TODO: no need to do this if we never get a null value for topLeft (see above comments)
  } else {
    return geometry
  }
}

export function createTextBox (fontSize = 16, text, resolution) {
  const textbox = document.createElement('div')

  textbox.class = 'text-box-size'
  textbox.style = `font-size: ${fontSize}; position: absolute; visibility: hidden; height: auto; width: auto; white-space: nowrap;`
  textbox.innerHTML += text
  document.getElementById('_vmf_hook').appendChild(textbox)

  return {
    height: textbox.clientHeight - 1,
    width: textbox.clientWidth - resolution
  }
}

export function translatePoint (pointGeom, angle = 0, distance, map) {
  const view = map.getView()
  const res = view.getResolution()
  const projection = view.getProjection()
  const properAngle = -radiansToDegrees(angle)
  const dist = distance * res
  const oneEighty = properAngle > 180 ? properAngle - 360 : properAngle

  return olKitTurf(turfDestination, [pointGeom, dist, oneEighty], projection).getGeometry()
}

export function pointsFromVertices (geometry) {
  const featureType = geometry.getType()
  const coordinates = getCoordinates(geometry, true)

  if (featureType === 'Polygon' || featureType === 'MultiLineString') {
    return [].concat(...coordinates)
  } else if (featureType === 'LineString' || featureType === 'MultiPoint') {
    return coordinates
  } else if (featureType === 'Point' || featureType === 'Circle') {
    return [coordinates]
  } else {
    ugh.warn('Geometries of type %s are not supported', featureType)

    return coordinates
  }
}

export function getText (labelProps = { text: '' }, resolution, opts = {}) {
  if (resolution > opts.maxreso) return ''

  switch (opts.type) {
    case 'hide':
      return ''
    case 'shorten':
      return labelProps.text.substring(0, 12)
    case 'wrap':
      return stringDivider(labelProps.text, 32, '\n')
    default:
      return labelProps.text
  }
}

export function getTextWidth (text = '') {
  // We want the width of the longest line of text so split with \n and reverse sort by length
  const lines = text.split(`\n`).sort((a, b) => b.length - a.length)
  const ctx = document.createElement('canvas').getContext('2d')
  const textMetrics = ctx.measureText(lines[0])
  const fontSize = ctx.font.split('px')[0] || 16

  return {
    width: textMetrics.width,
    fontSize
  }
}

export function stringDivider (str, width, spaceReplacer) {
  if (str.length > width) {
    let p = width

    while (p > 0 && (str[p] !== ' ' && str[p] !== '-')) {
      p--
    }
    if (p > 0) {
      let left

      if (str.substring(p, p + 1) === '-') {
        left = str.substring(0, p + 1)
      } else {
        left = str.substring(0, p)
      }
      const right = str.substring(p + 1)

      return left + spaceReplacer + stringDivider(right, width, spaceReplacer)
    }
  }

  return str
}

export function calculateScale (map, feature) {
  const currentResolution = map.getView().getResolution()
  const vmfLabel = feature.get('_vmf_label') || {}
  const labelResolution = vmfLabel.resolution || currentResolution
  const scaleFactor = labelResolution / currentResolution

  return vmfLabel.scaling ? scaleFactor : 1
}

export function formatStyleString (textStyle) {
  const font = textStyle.getFont() || 14
  const scale = textStyle.getScale() || 1
  const px = font.indexOf('px')
  const size = font.slice(px - 2, px)
  const scaledSize = (size - 6) * scale // Size - 6 is just done to make the text appear the same relative size as it is on the map
  const scaledFont = font.replace(`${size}px`, `${scaledSize}px`)
  const fillColor = textStyle.getFill().getColor()
  const stroke = textStyle.getStroke()
  const strokeColor = stroke.getColor()
  const strokeWidth = stroke.getWidth()

  return `font: ${scaledFont}; letter-spacing: 0px; paint-order: stroke; stroke: ${strokeColor}; stroke-width: ${strokeWidth}; fill: ${fillColor}`
}
