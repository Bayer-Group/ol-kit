import olFeature from 'ol/Feature'
import olGeomLineString from 'ol/geom/LineString'
import olGeomMultiPoint from 'ol/geom/MultiPoint'
import olStyleFill from 'ol/style/Fill'
import olStyleStroke from 'ol/style/Stroke'
import olStyleStyle from 'ol/style/Style'
import olStyleCircle from 'ol/style/Circle'
import olStyleText from 'ol/style/Text'
import olPoint from 'ol/geom/Point'
import centroid from '@turf/centroid'

import { pointsFromVertices, olKitTurf, pairCoordinates, getCoordinates, getText, calculateScale } from './utils'

function resolveStyleFunctionArgs (args) {
  // Using function.prototype.bind with additional arguments injects those arguments at the zeroth index of the arguements object and since opts is optional we need to handle a variable arguement object
  const argLength = args.length
  const feature = args[argLength - 2] || args
  const resolution = args[argLength - 1]
  const opts = argLength >= 3 ? args[0] : {}

  return { feature, resolution, opts }
}

/**
 * Style ol/Features
 * @function
 * @param {object} opts - The config object
 * @param {ol/Feature} feature - The feature you want to style
 * @param {number} resolution - the resolution of the map
 * @returns {object} The style object for the passed feature
 */
function styleText (...args) {
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
    text: getText(label, resolution, opts),
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

function coordinateLabels (multiPoint, resolution, opts) {
  return multiPoint.getPoints().map(point => coordinateLabel(point, resolution, opts))
}

function coordinateLabel (pointGeometry, resolution, opts) {
  const geom = pointGeometry.clone()
  const pointFeature = new olFeature({
    geometry: geom,
    _vmf_label: {
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

function lengthLabel (lineGeometry, resolution, opts) {
  const geom = lineGeometry.clone()
  const perimeterFeature = new olFeature({
    geometry: geom,
    _vmf_type: '_vmf_measurement',
    _vmf_label: {
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

function perimeterSegmentLabels (polygonGeometry, resolution, opts) {
  const labelStyles = []
  const clonedGeom = polygonGeometry.clone()
  const perimeterCoords = clonedGeom.getLinearRing(0).getCoordinates()

  for (let i = 0; i < perimeterCoords.length - 1;) {
    const segment = [perimeterCoords[i], perimeterCoords[i += 1]]

    if (segment.flat(Infinity).includes(undefined)) break // exit the loop if we get any undefined values.  It's better to not label a segment than to break draw entirely.
    const segmentGeom = new olGeomLineString(segment)
    const segmentFeature = new olFeature({
      geometry: segmentGeom,
      _vmf_type: '_vmf_measurement',
      _vmf_label: {
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

function areaLabel (polygonGeometry, resolution, opts) {
  const areaGeometry = polygonGeometry.clone()
  const areaFeature = new olFeature({
    geometry: areaGeometry,
    _vmf_type: '_vmf_measurement',
    _vmf_label: {
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

function centroidLabel (geometry, resolution, opts) {
  const point = geometry.getType() === 'Circle ' ? new olPoint(geometry.clone().getCenter()) : olKitTurf(centroid, [geometry]).getGeometry()
  const pointFeature = new olFeature({
    geometry: point,
    _vmf_type: '_vmf_measurement', // styleText determines the type of label to render based on the feature's type so we need this temporary feature to be a 'measurement' feature
    _vmf_label: {
      fontSize: 16
    },
    _ol_kit_needs_centroid_label: true
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

function getVertices (args) {
  const { feature } = resolveStyleFunctionArgs(args)
  const geometry = feature.getGeometry()
  const layout = geometry.getLayout()

  switch (geometry.getType()) {
    case 'MultiPolygon': {
      const coordinates = geometry.getCoordinates()
      const flatCoords = coordinates.flat(Infinity)
      const pairedCoords = pairCoordinates(flatCoords, layout.length)

      return new olGeomMultiPoint(pairedCoords, 'XYZ')
    }
    case 'GeometryCollection': {
      const deepCoords = getCoordinates(geometry)
      const flatCoords = deepCoords.flat(Infinity)
      const pairedCoords = pairCoordinates(flatCoords, layout.length)

      return new olGeomMultiPoint(pairedCoords)
    }
    default:
      return new olGeomMultiPoint(pointsFromVertices(geometry))
  }
}

/**
 * Style an ol/Feature with orange circle vertices, a blue outline, an area label, and a perimeter length label. Can be used with individual features as a style function or call it directly to get a style object for use with `vectorContext.drawFeature`
 * @function
 * @since 6.3.0
 * @param {object} opts - The config object
 * @param {ol/Feature} feature - The feature you want to style
 * @param {number} resolution - the resolution of the map
 * @returns {object} The style object for the passed feature
 */
export function immediateEditStyle (...args) { // eslint-disable-line
  const { feature, resolution, opts = {} } = resolveStyleFunctionArgs(args)
  const fill = new olStyleFill({
    color: 'rgba(0, 0, 255, 0.2)'
  })
  const stroke = new olStyleStroke({
    color: 'blue',
    width: 3
  })
  const image = new olStyleCircle({
    radius: 7,
    fill: new olStyleFill({
      color: '#ffcc33'
    })
  })
  const vertexGeometry = getVertices(args)
  const vertices = [new olStyleStyle({
    image: new olStyleCircle({
      radius: 5,
      fill: new olStyleFill({
        color: 'orange'
      })
    }),
    geometry: vertexGeometry
  })]

  // checking to see if opts.geometry is defined allows us to call this function recursively for geometry collections
  const geometry = opts.geometry || feature.clone().getGeometry()
  const areaLabelsFlag = feature.get('_ol_kit_area_labels')
  const distanceLabelsFlag = feature.get('_ol_kit_distance_labels')
  const isLegacyMeasure = feature.get('_vmf_type') === '_vmf_measurement' && !(distanceLabelsFlag || areaLabelsFlag) // ignore legacy measure flag if either of the new flags are used.  Legacy features won't have the new flags and new features will only have the legacy flag if it also has one of the new flags (we still add the legacy flag to avoid a breaking change).
  const needsVertexLabels = feature.get('_ol_kit_coordinate_labels') !== undefined
  const needsCentroidLabels = feature.get('_ol_kit_needs_centroid_label') !== undefined
  const needsAreaLabels = opts.showMeasurements ? areaLabelsFlag : isLegacyMeasure
  const needsDistanceLabels = opts.showMeasurements ? (distanceLabelsFlag) : isLegacyMeasure
  const isNotCircle = feature.get('_ol_kit_draw_mode') !== 'circle'
  const vertexLabels = (needsVertexLabels && opts.showMeasurements && isNotCircle) ? coordinateLabels(getVertices(feature), resolution, opts) : [] // eslint-disable-line

  switch (geometry.getType()) {
    case 'Point':
      return [new olStyleStyle({
        image
      }), ...vertexLabels]
    case 'LineString': {
      const lengthLabels = needsDistanceLabels ? [lengthLabel(geometry, resolution, opts)] : []

      return [new olStyleStyle({
        stroke,
        image
      }), ...vertices, ...lengthLabels, ...vertexLabels]
    }
    case 'MultiLineString': {
      const lineStrings = geometry.getLineStrings()
      const lengthLabels = needsDistanceLabels
        ? lineStrings.map(lineString => lengthLabel(lineString, resolution, opts)) : []

      return [new olStyleStyle({
        stroke,
        image
      }), ...vertices, ...lengthLabels, ...vertexLabels]
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
        fill,
        image
      }), ...vertices, ...areaLabels, ...perimeterLabels.flat(Infinity), ...vertexLabels]
    }
    case 'Polygon': {
      let labels = vertexLabels // eslint-disable-line

      if (needsAreaLabels) labels.push(areaLabel(geometry, resolution, opts))
      if (needsDistanceLabels && isNotCircle) labels = [...labels, ...perimeterSegmentLabels(geometry, resolution, opts)] //eslint-disable-line
      if (needsCentroidLabels) labels.push(centroidLabel(geometry, resolution, opts))

      return [new olStyleStyle({
        stroke,
        fill,
        image
      }), ...vertices, ...labels]
    }
    case 'GeometryCollection': {
      // Recursive.  Since feature stores our metadata it needs to be preserved.  Therefore we pass the geometry we want to use through the opts object.
      const componentStyles = geometry.getGeometries().map(geom => {
        return immediateEditStyle.apply(this, [Object.assign(opts, { geometry: geom }), feature, resolution])
      })
      const flatStyles = componentStyles.flat(Infinity)

      return flatStyles
    }
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
      return [new olStyleStyle({
        stroke,
        fill,
        image
      }), ...vertices]
  }
}
