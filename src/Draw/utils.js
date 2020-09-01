import ugh from 'ugh'
import olFeature from 'ol/feature'
import olGeomLineString from 'ol/geom/linestring'
import olStyleFill from 'ol/style/fill'
import olStyleStroke from 'ol/style/stroke'
import olStyleStyle from 'ol/style/style'
import olStyleCircle from 'ol/style/circle'
import olStyleText from 'ol/style/text'
import olPoint from 'ol/geom/point'
import centroid from '@turf/centroid'
import olProj from 'ol/proj'
import olFormatGeoJson from 'ol/format/geojson'
import olCollection from 'ol/collection'
import olSphere from 'ol/sphere'
import olGeomPolygon from 'ol/geom/polygon'

const EPSG = 'EPSG:4326'

const CONVERSION = {
  /* Conversion factors between meters which is returned by EPSG:4326
  and the user requested units */
  'feet': 3.28084,
  'miles': 0.000621371,
  'nautical-miles': 0.000539957,
  'yards': 1.09361,
  'kilometers': 0.001,
  'meters': 1,
  'acres': 0.000247105, // 1 square meter = 0.000247105 acres
  'hectares': 0.0001 // 1 square meter = 0.0001 hectares
}
const SPHERE = new olSphere(6378137)

function myLocaleString (value, language) {
  return Number(value).toLocaleString(language)
}

function resolveStyleFunctionArgs (args) {
  // Using function.prototype.bind with additional arguments injects those arguments at the zeroth index of the arguements object and since opts is optional we need to handle a variable arguement object
  const argLength = args.length
  const feature = args[argLength - 2] || args
  const resolution = args[argLength - 1]
  const opts = argLength >= 3 ? args[0] : {}

  return { feature, resolution, opts }
}


function getText (labelProps = { text: '' }, resolution, opts = {}) {
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

function getTextWidth (text = '', map) {
  // We want the width of the longest line of text so split with \n and reverse sort by length
  const lines = text.split(`\n`).sort((a, b) => b.length - a.length)
  // ol does not document this but if this needs to be faster we can get the context with `const ctx = map.renderer_.context_`
  const targetEl = map.getViewport()
  const canvas = Array.from(targetEl.children).find(child => child.tagName === 'CANVAS')
  const ctx = canvas.getContext('2d')
  // As of Chrome v75.0.3770.142 `CanvasRenderingContext2D.measureText()` only returns the wiodth but in the future it should be able to return additional measurement information
  const textMetrics = ctx.measureText(lines[0])
  const fontSize = ctx.font.split('px')[0] || 16

  return {
    width: textMetrics.width,
    fontSize
  }
}

function stringDivider (str, width, spaceReplacer) {
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

function calculateScale (map, feature) {
  const currentResolution = map.getView().getResolution()
  const vmfLabel = feature.get('_vmf_label') || {}
  const labelResolution = vmfLabel.resolution || currentResolution
  const scaleFactor = labelResolution / currentResolution

  return vmfLabel.scaling ? scaleFactor : 1
}

function formatStyleString (textStyle) {
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

function calcGeodesicLength (sourceProj, lineString) {
  let length = 0

  const projLineString = lineString.clone().transform(sourceProj, EPSG)
  const coordinates = projLineString.getCoordinates()

  for (let i = 0, ii = coordinates.length - 1; i < ii; ++i) {
    length += SPHERE.haversineDistance(coordinates[i], coordinates[i + 1])
  }

  return length
}

function convertGeodesicArea (area, units) {
  const c = CONVERSION[units]

  // Acres and hectares are already squared
  if (['acres', 'hectares'].includes(units)) {
    return area * c
  }

  return area * c * c
}

function calcGeodesicArea (sourceProj, polygon) {
  const projPolygon = polygon.clone().transform(sourceProj, EPSG)

  const coordinates = projPolygon.getLinearRing(0).getCoordinates()

  /** Calculate geodesic area in meters */
  const area = SPHERE.geodesicArea(coordinates)

  return Math.abs(area)
}

function calculateGeodesic (map, geometry, units = 'meters') {
  const type = geometry.getType()
  const sourceProj = map.getView().getProjection()

  if (type === 'Polygon') {
    return convertGeodesicArea(calcGeodesicArea(sourceProj, geometry), units).toFixed(2)
  } else if (type === 'LineString') {
    return (calcGeodesicLength(sourceProj, geometry) * CONVERSION[units]).toFixed(2)
  } else if (type === 'Circle') {
    return (Math.PI * Math.pow(geometry.getRadius(), 2)) * CONVERSION[units]
  } else {
    return 0
  }
}

function calculateAreaAndDistance (map, geometry, areaUnit, distanceUnit) {
  const type = geometry.getType()
  const sourceProj = map.getView().getProjection()

  if (type === 'LineString') {
    return {
      area: null,
      distance: calcGeodesicLength(sourceProj, geometry) * CONVERSION[distanceUnit]
    }
  } else if (type === 'Circle') {
    // convert circle types into polygons to get accurate distance/area measurements when resizing
    const polygonGeom = olGeomPolygon.fromCircle(geometry)

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

function getMeasurementText (opts, geom) {
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


function turf (turfFunc, argArray, projection = 'EPSG:3857') {
  const transformedArgs = argArray.map((arg) => {
    return transform(arg, projection, true)
  })
  const turfResults = turfFunc.apply(this, transformedArgs)

  return transform(turfResults, projection, false)
}

function transform (value, projection, toWgs84) {
  const { type } = describeType(value)
  const format = new olFormatGeoJson({
    defaultDataProjection,
    featureProjection: projection
  })

  return toWgs84
    ? input(value, projection, type, format)
    : output(value, projection, type, format)
}

function input (value, projection, type, format) {
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

function output (value, projection, type, format) {
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
function describeType (query) {
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

function getCoordinates (geometry, optCircle = false) {
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

function flatten (array) {
  if (Array.prototype.flat && typeof Array.prototype.flat === 'function') return array.flat(Infinity)

  return array.reduce((flat, toFlatten) => {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten)
  }, [])
}

function scaleDistanceToMap (distance, map) {
  const currentResolution = map.getView().getResolution()

  return distance * currentResolution
}

/**
 * Generate a 2D array of features paired to a style representing how they are currently styled on the map.
 * OpenLayers Features will inherit the style set on their parent layer if their own style is undefined.  This Function helps resolve the style that is actually being used to render the feature on the map.
 * @function getStyledFeatures
 * @param {Object[]} layers - The Openlayers Layers you want to get the features from.
 * @param {Number} [resolution] - The map's current resolution.
 */
export function getStyledFeatures (layers, resolution) {
  const layerStyleMapper = (layer) => { // this function returns the features in a layer with the layer's style function, returning [[features], layerStyleFunction]
    const layerStyle = layer.getStyleFunction()

    // This function needs to handle each type of layer differently so these conditionals check the type of layer
    if (typeof layer?.getSource?.()?.getFeatures === 'function') { // handle an OpenLayers vector layer (with a vector source)
      const source = layer.getSource()
      const sourceFeatures = source.getFeatures()

      return [sourceFeatures, layerStyle]
    } else if (layer.isCatalogLayer) { // handle a vmf CatalogLayer
      const source = layer.getWfsSource()
      const sourceFeatures = source.getFeatures()

      return [sourceFeatures, layerStyle]
    } // we may need to eventually handle GeoserverLayers here...
  }
  const featuresReducer = (acc, [features, layerStyleFunction]) => { // This function reduces [[[features], layerStyleFunction], ...] to [[feature1, featureStyle1], [feature2, featureStyle2], ...]
    const featureStyleMapper = (feature, idx) => {
      // Try every avenue for getting the style from the feature itself since that style will override the layer's style.
      const featureStyleFunction = feature.getStyleFunction()
      const featureStyle = typeof featureStyleFunction === 'function'
        ? featureStyleFunction.call(feature, resolution) // eslint-disable-line no-useless-call // This isn't actually a useless call and I don't know why eslint doesn't like it.
        : feature.getStyle()

      if (featureStyle || !layerStyleFunction) { // If we have a valid style from the feature we use that.  This is an or because if we don't have a style from the feature or the layer than we return it as undefined.
        return [feature, featureStyle]
      } else { // try to call the layerStyleFunction with the expected parameters and use that style.
        try {
          const generatedStyle = layerStyleFunction.bind(this, feature, resolution)()

          return [feature, generatedStyle]
        } catch (error) { // we've failed to resolve the feature's style and return undefined as the style.
          ugh.warn(`Geokit was unable to get the style object for feature at index ${idx} from it's layer's style function due to the following error.`, error)

          return [feature, undefined]
        }
      }
    }
    const associatedPairs = features.map(featureStyleMapper)

    return [...acc, ...associatedPairs]
  }
  const styledLayers = layers.filter(layer => typeof layer.getStyle === 'function')
  // get the features for each layer in a 2d array paired with the style function associated with that layer
  const featuresAndStyles = styledLayers.map(layerStyleMapper)
  // get a 2d array of each feature paired with the either the style set directly on the feature OR the style generated by the parent layer's style function called with that feature and the (optional) resolution as arguments.
  const featureStyles = featuresAndStyles.reduce(featuresReducer, [])

  return featureStyles
}

/**
 * Style ol/features
 * @function
 * @param {object} opts - The config object
 * @param {ol/Feature} feature - The feature you want to style
 * @param {number} resolution - the resolution of the map
 * @returns {object} The style object for the passed feature
 */
export function styleText (...args) {
  const { feature, resolution, opts } = resolveStyleFunctionArgs(args)
  const label = feature.get('_vmf_label')
  const isMeasurement = feature.get('_vmf_type') === '_vmf_measurement'
  const isCentroidLabel = feature.get('_ol_kit_needs_centroid_label')
  const offsetY = isCentroidLabel ? 20 : isMeasurement ? 0 : (label.fontSize || 16) / 2 // eslint-disable-line
  const styleOpts = {
    placement: opts.placement || 'point',
    textAlign: opts.textAlign,
    textBaseline: opts.textBaseLine || 'top',
    maxAngle: opts.maxAngle || Infinity,
    // These weird calculations provide the most accurate placement relative to the textarea where people edit their text
    offsetX: isMeasurement ? 0 : (label.fontSize || 16) / 2,
    offsetY: offsetY,
    rotation: -feature.get('_vmf_rotation') || 0,
    font: `bold ${label.fontSize || 16}px sans-serif`,
    stroke: new olStyleStroke({
      // show a black outline unless the text color is black; then show a white outline
      color: label.color === '#000000' ? '#ffffff' : '#000000',
      width: 3
    }),
    text: isMeasurement
      ? getMeasurementText(opts.store, feature.getGeometry())
      : getText(label, resolution, opts),
    scale: calculateScale(opts.store.map, feature),
    fill: new olStyleFill({
      color: label.color || '#ffffff'
    }),
    image: new olStyleCircle({
      radius: 7,
      fill: new olStyleFill({
        color: '#ffcc33'
      })
    }),
    rotateWithView: false,
    overflow: true
  }

  return new olStyleText(styleOpts)
}

export function styleMeasure (map, feature, resolution, optsArg = {}) {
  const opts = { ...optsArg, map, store: { map } } // backwards compatible with redux store
  const fill = new olStyleFill({
    color: 'rgba(255, 255, 255, 0.5)',
    opacity: 1
  })
  const stroke = new olStyleStroke({
    color: '#000000',
    width: 3,
    lineDash: [10, 0, 10],
    opacity: 1
  })

  // checking to see if .geometry is defined allows us to call this function recursively for geometry collections
  const geometry = feature.getGeometry()
  const areaLabelsFlag = feature.get('_ol_kit_area_labels')
  const distanceLabelsFlag = feature.get('_ol_kit_distance_labels')
  const isLegacyMeasure = feature.get('_vmf_type') === '_vmf_measurement' && !(distanceLabelsFlag || areaLabelsFlag) // ignore legacy measure flag if either of the new flags are used.  Legacy features won't have the new flags and new features will only have the legacy flag if it also has one of the new flags (we still add the legacy flag to avoid a breaking change).
  const needsVertexLabels = feature.get('_ol_kit_coordinate_labels') !== undefined
  const needsCentroidLabels = feature.get('_ol_kit_needs_centroid_label') !== undefined
  const needsAreaLabels = areaLabelsFlag || isLegacyMeasure
  const needsDistanceLabels = distanceLabelsFlag || isLegacyMeasure
  const isNotCircle = feature.get('_ol_kit_draw_mode') !== 'circle'
  const vertexLabels = needsVertexLabels && isNotCircle ? coordinateLabels(getVertices(feature), resolution, opts) : []

  switch (geometry.getType()) {
    case 'Point':
      return [new olStyleStyle({
        image: new olStyleCircle({
          radius: 5,
          fill: new olStyleFill({
            color: 'rgba(255, 255, 255, 0.75)'
          }),
          stroke: new olStyleStroke({
            color: 'rgb(66, 188, 244)',
            width: 1
          })
        })
      }), ...vertexLabels]
    case 'LineString': {
      const lengthLabels = needsDistanceLabels ? [lengthLabel(geometry, resolution, opts, opts)] : []

      return [new olStyleStyle({
        stroke
      }), ...lengthLabels, ...vertexLabels]
    }
    case 'MultiLineString': {
      const lineStrings = geometry.getLineStrings()
      const lengthLabels = needsDistanceLabels
        ? lineStrings.map(lineString => lengthLabel(lineString, resolution, opts)) : []

      return [new olStyleStyle({
        stroke
      }), ...lengthLabels, ...vertexLabels]
    }
    case 'MultiPolygon': {
      const polygons = geometry.getPolygons()
      // create a label for each polygon
      const perimeterLabels = needsDistanceLabels
        ? polygons.map(polygon => perimeterSegmentLabels(polygon, resolution, opts)) : []
      const areaLabels = needsAreaLabels
        ? polygons.map(polygon => areaLabel(polygon, resolution, opts)) : []

      return [new olStyleStyle({
        stroke,
        fill
      }), ...areaLabels, ...perimeterLabels.flat(Infinity), ...vertexLabels]
    }
    case 'Polygon': {
      let labels = vertexLabels

      if (needsAreaLabels) labels.push(areaLabel(geometry, resolution, opts))
      if (needsDistanceLabels && isNotCircle) labels = [...labels, ...perimeterSegmentLabels(geometry, resolution, opts)] //eslint-disable-line
      if (needsCentroidLabels) labels.push(centroidLabel(geometry, resolution, opts))

      return [new olStyleStyle({
        stroke,
        fill
      }), ...labels]
    }
    case 'GeometryCollection':
      return geometry.getGeometries().map(geom => {
        return styleMeasure(map, feature, resolution, opts)
      })
    case 'Circle': {
      const labels = vertexLabels

      if (needsAreaLabels) labels.push(areaLabel(geometry, resolution, opts))
      if (needsCentroidLabels) labels.push(centroidLabel(geometry, resolution, opts))

      return [new olStyleStyle({
        stroke,
        fill
      }), ...labels]
    }
    default:
      return new olStyleStyle({
        stroke,
        fill
      })
  }
}

export function coordinateLabels (multiPoint, resolution, opts) {
  return multiPoint.getPoints().map(point => coordinateLabel(point, resolution, opts))
}

export function coordinateLabel (pointGeometry, resolution, opts) {
  const geom = pointGeometry.clone()
  const pointFeature = new olFeature({
    geometry: geom,
    '_vmf_type': '_vmf_measurement', // styleText determines the type of label to render based on the feature's type so we need this temporary feature to be a 'measurement' feature
    '_vmf_label': {
      fontSize: 16
    }
  })

  return new olStyleStyle({
    text: styleText({
      store: opts,
      placement: 'point',
      maxAngle: Math.PI / 4,
      textAlign: undefined,
      textBaseline: 'hanging'
    }, pointFeature, resolution),
    geometry: geom
  })
}

export function lengthLabel (lineGeometry, resolution, opts) {
  const geom = lineGeometry.clone()
  const perimeterFeature = new olFeature({
    geometry: geom,
    '_vmf_type': '_vmf_measurement',
    '_vmf_label': {
      fontSize: 16
    }
  })

  return new olStyleStyle({
    text: styleText({
      store: opts,
      placement: 'line',
      maxAngle: Math.PI / 4,
      textAlign: undefined,
      textBaseline: 'hanging'
    }, perimeterFeature, resolution),
    geometry: geom
  })
}

export function perimeterLabel (polygonGeometry, resolution, opts) {
  const clonedGeom = polygonGeometry.clone()
  const perimeterCoords = clonedGeom.getLinearRing(0).getCoordinates()
  const perimeterFeature = new olFeature({
    geometry: new olGeomLineString(perimeterCoords),
    '_vmf_type': '_vmf_measurement',
    '_vmf_label': {
      fontSize: 16
    }
  })

  return new olStyleStyle({
    text: styleText({
      store: opts,
      placement: 'line',
      maxAngle: Math.PI / 4,
      textAlign: undefined,
      textBaseline: 'hanging'
    }, perimeterFeature, resolution),
    geometry: clonedGeom
  })
}

export function perimeterSegmentLabels (polygonGeometry, resolution, opts) {
  const labelStyles = []
  const clonedGeom = polygonGeometry.clone()
  const perimeterCoords = clonedGeom.getLinearRing(0).getCoordinates()

  for (let i = 0; i < perimeterCoords.length - 1;) {
    const segment = [perimeterCoords[i], perimeterCoords[i += 1]]

    if (segment.flat(Infinity).includes(undefined)) break // exit the loop if we get any undefined values.  It's better to not label a segment than to break draw entirely.
    const segmentGeom = new olGeomLineString(segment)
    const segmentFeature = new olFeature({
      geometry: segmentGeom,
      '_vmf_type': '_vmf_measurement',
      '_vmf_label': {
        fontSize: 16
      }
    })

    labelStyles.push(new olStyleStyle({
      text: styleText({
        store: opts,
        placement: 'line',
        textBaseline: 'hanging'
      }, segmentFeature, resolution),
      geometry: segmentGeom
    }))
  }

  return labelStyles
}

export function areaLabel (polygonGeometry, resolution, opts) {
  const areaGeometry = polygonGeometry.clone()
  const areaFeature = new olFeature({
    geometry: areaGeometry,
    '_vmf_type': '_vmf_measurement',
    '_vmf_label': {
      fontSize: 16
    }
  })

  return new olStyleStyle({
    text: styleText({
      store: opts
    }, areaFeature, resolution),
    geometry: areaGeometry
  })
}

export function centroidLabel (geometry, resolution, opts) {
  const point = geometry.getType() === 'Circle ' ? new olPoint(geometry.clone().getCenter()) : turf(centroid, [geometry]).getGeometry()
  const pointFeature = new olFeature({
    geometry: point,
    '_vmf_type': '_vmf_measurement', // styleText determines the type of label to render based on the feature's type so we need this temporary feature to be a 'measurement' feature
    '_vmf_label': {
      fontSize: 16
    },
    '_ol_kit_needs_centroid_label': true
  })

  return new olStyleStyle({
    text: styleText({
      store: opts,
      placement: 'point',
      maxAngle: Math.PI / 4,
      textAlign: undefined,
      textBaseline: 'hanging'
    }, pointFeature, resolution),
    geometry: point
  })
}


