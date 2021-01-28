import { assertTurf } from './assertions'

import * as olProj from 'ol/proj'
import olFormatGeoJson from 'ol/format/GeoJSON'
import olFeature from 'ol/Feature'
import olCollection from 'ol/Collection'

const defaultDataProjection = 'EPSG:4326'

export default function turf (turfFunc, argArray, projection = 'EPSG:3857') {
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
