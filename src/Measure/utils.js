import { getDistance, getArea } from 'ol/sphere'
import olGeomLineString from 'ol/geom/LineString'
import { fromCircle } from 'ol/geom/Polygon'
const EPSG = 'EPSG:4326'

const CONVERSION = {
  /* Conversion factors between meters which is returned by EPSG:4326
  and the user requested units */
  feet: 3.28084,
  miles: 0.000621371,
  'nautical-miles': 0.000539957,
  yards: 1.09361,
  kilometers: 0.001,
  meters: 1,
  acres: 0.000247105, // 1 square meter = 0.000247105 acres
  hectares: 0.0001 // 1 square meter = 0.0001 hectares
}

export function myLocaleString (value, language) {
  return Number(value).toLocaleString(language)
}

export function calcGeodesicLength (sourceProj, lineString) {
  let length = 0

  const projLineString = lineString.clone().transform(sourceProj, EPSG)
  const coordinates = projLineString.getCoordinates()

  for (let i = 0, ii = coordinates.length - 1; i < ii; ++i) {
    length += getDistance(coordinates[i], coordinates[i + 1])
  }

  return length
}

export function convertGeodesicArea (area, units) {
  const c = CONVERSION[units]

  // Acres and hectares are already squared
  if (['acres', 'hectares'].includes(units)) {
    return area * c
  }

  return area * c * c
}

export function calcGeodesicArea (sourceProj, polygon) {
  /** Calculate geodesic area in meters */
  const area = getArea(polygon)

  return Math.abs(area)
}

export function calculateGeodesic (map, geometry, units = 'meters') {
  const type = geometry.getType()
  const sourceProj = map.getView().getProjection()

  if (type === 'Polygon') {
    return convertGeodesicArea(calcGeodesicArea(sourceProj, geometry), units).toFixed(2)
  } else if (type === 'LineString') {
    return (calcGeodesicLength(sourceProj, geometry) * CONVERSION[units]).toFixed(2)
  } else if (type === 'Circle') {
    return (Math.PI * Math.pow(geometry.getRadius(), 2)) * CONVERSION[units] // this should be able to use `getArea` but needs to be tested first
  } else {
    return 0
  }
}

export function calculateAreaAndDistance (map, geometry, areaUnit, distanceUnit) {
  const type = geometry.getType()
  const sourceProj = map.getView().getProjection()

  if (type === 'LineString') {
    return {
      area: null,
      distance: calcGeodesicLength(sourceProj, geometry) * CONVERSION[distanceUnit]
    }
  } else if (type === 'Circle') {
    // convert circle types into polygons to get accurate distance/area measurements when resizing
    const polygonGeom = fromCircle(geometry)

    return calculateAreaAndDistance(map, polygonGeom, areaUnit, distanceUnit)
  } else if (type === 'Polygon') {
    const lineString = new olGeomLineString(geometry.getLinearRing(0).getCoordinates())

    return {
      area: convertGeodesicArea(calcGeodesicArea(sourceProj, geometry), areaUnit),
      distance: calcGeodesicLength(sourceProj, lineString) * CONVERSION[distanceUnit]
    }
  } else {
    return {
      area: null,
      distance: null
    }
  }
}

export function getMeasurementText (opts, geom) {
  const { distanceUOM, areaUOM, map, translations, language } = opts
  const sourceProj = map.getView().getProjection()
  const type = geom.getType()

  if (type === 'Point') {
    return geom.clone()
      .transform(sourceProj, EPSG)
      .getCoordinates()
      .map(coord => `${coord.toFixed(6)}`) // use this step to format the coordinate string
      .reverse()
      .join(', ')
  }

  const unit = type === 'Circle' || type === 'Polygon' ? areaUOM : distanceUOM
  const measurement = calculateGeodesic(map, geom, unit)

  return formatMeasurement(geom, measurement, { unit, translations, language })
}

function formatMeasurement (geom, measurement, opts) {
  const squareless = ['acres', 'hectares']
  const squareGeoms = ['Polygon', 'MultiPolygon', 'Circle', 'Box']
  const { unit, language } = opts
  const isSquareUnit = squareGeoms.includes(geom.getType()) && !squareless.includes(unit)
  const prettyValue = myLocaleString(measurement, language)

  return unit ? `${prettyValue}${isSquareUnit ? ' sq. ' : ' '}${unit.split('-').join(' ')}` : ''
}
