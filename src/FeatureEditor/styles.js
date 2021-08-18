import olFeature from 'ol/Feature'
import olGeomLineString from 'ol/geom/LineString'
import olGeomMultiPoint from 'ol/geom/MultiPoint'
import olStyleFill from 'ol/style/Fill'
import olStyleStroke from 'ol/style/Stroke'
import olStyleStyle from 'ol/style/Style'
import olStyleCircle from 'ol/style/Circle'
import olStyleIcon from 'ol/style/Icon'
import olStyleText from 'ol/style/Text'
import olGeomCircle from 'ol/geom/Circle'
import olPoint from 'ol/geom/Point'
import centroid from '@turf/centroid'

// import { icons } from '../../svgs'
// import { flatten, scaleDistanceToMap } from 'utils/general'
// import vmfReserved from 'constants/vmfReserved'
// import { getSVGUri } from 'utils/mapMarkers'
// import { pairCoords, getCoordinates } from 'utils/coords'
// import { getMeasurementText } from 'utils/measure'
// import { getText, calculateScale, getTextWidth } from 'utils/text'
import { pointsFromVertices, translatePoint } from './utils'
// import turf from 'utils/astro'

export function markerStyler (feature, icons) {
  return function () {
    const { iconName, iconColor, iconSize } = feature.get('_vmf_icon')

    return new olStyleStyle({
      image: new olStyleIcon({
        anchor: [0.5, 0.5],
        opacity: 1,
        src: `data:image/svg+xml;utf8,${getSVGUri(icons[iconName], { fill: iconColor, size: iconSize })}`,
        scale: 4,
        rotation: (feature.get('_vmf_rotation') * -1) || 0
      })
    })
  }
}

export function resolveStyleFunctionArgs (args) {
  // Using function.prototype.bind with additional arguments injects those arguments at the zeroth index of the arguements object and since opts is optional we need to handle a variable arguement object
  const argLength = args.length
  const feature = args[argLength - 2] || args
  const resolution = args[argLength - 1]
  const opts = argLength >= 3 ? args[0] : {}

  return { feature, resolution, opts }
}

export function styleDefault (map, feature, resolution, optsArg = {}) {
  const opts = { ...optsArg, map, store: { map } } // backwards compatible with redux store
  /** FUNCTION TO DYNAMICALLY DETERMINE STYLE OF FEATURE */
  const image = new olStyleCircle({
    radius: 5,
    fill: new olStyleFill({
      color: 'rgba(255, 255, 255, 0.75)'
    }),
    stroke: new olStyleStroke({
      color: 'rgb(66, 188, 244)',
      width: 1
    })
  })
  const styles = {
    'Point': new olStyleStyle({
      image: image
    }),
    'LineString': new olStyleStyle({
      stroke: new olStyleStroke({
        color: 'rgb(66, 188, 244)',
        width: 5
      })
    }),
    'MultiLineString': new olStyleStyle({
      stroke: new olStyleStroke({
        color: 'rgb(66, 188, 244)',
        lineDash: [15, 0, 10],
        width: 5
      })
    }),
    'MultiPoint': new olStyleStyle({
      image: image
    }),
    'MultiPolygon': new olStyleStyle({
      stroke: new olStyleStroke({
        color: 'rgb(66, 188, 244)',
        width: 2
      }),
      fill: new olStyleFill({
        color: 'rgba(66, 188, 244, 0.2)'
      })
    }),
    'Polygon': new olStyleStyle({
      stroke: new olStyleStroke({
        color: 'rgba(41,128,185,1)',
        width: 3
      }),
      fill: new olStyleFill({
        color: 'rgba(255, 255, 255, 0.75)'
      })
    }),
    'GeometryCollection': new olStyleStyle({
      stroke: new olStyleStroke({
        color: 'magenta',
        width: 3
      }),
      fill: new olStyleFill({
        color: 'magenta'
      }),
      image: new olStyleCircle({
        radius: 10,
        fill: null,
        stroke: new olStyleStroke({
          color: 'magenta'
        })
      })
    }),
    'Circle': new olStyleStyle({
      stroke: new olStyleStroke({
        color: 'rgba(41,128,185,1)',
        width: 3
      }),
      fill: new olStyleFill({
        color: 'rgba(255, 255, 255, 0.75)'
      })
    })
  }
  const needsVertexLabels = feature.get('_ol_kit_coordinate_labels')
  const style = styles[feature.getGeometry().getType()]
  const label = () => {
    const rotation = -feature.get(vmfReserved.rotation) || 0 // we need the negative of the rotation due to the way ol works with rotation

    return new olStyleStyle({
      geometry: function (olFeature) {
        return olFeature.getGeometry()
      },
      text: styleText({
        store: opts.store,
        placement: 'point',
        textAlign: 'left',
        textBaseLine: 'bottom',
        rotation
      }, feature, resolution)
    })
  }

  const marker = (iconName, opts) => {
    return new olStyleStyle({
      image: new olStyleIcon({
        anchor: [0.5, 0.5],
        opacity: 1,
        src: `data:image/svg+xml;utf8,${getSVGUri(icons[iconName], { fill: opts.iconColor, size: opts.iconSize })}`,
        scale: 4,
        rotation: (feature.get('_vmf_rotation') * -1) || 0
      })
    })
  }
  const featureProps = feature.getProperties()
  const iconProps = featureProps[vmfReserved.marker]

  switch (feature.get(vmfReserved.type)) {
    case vmfReserved.annotation:
      return label()
    case vmfReserved.marker:
      return marker(iconProps.iconName, { iconColor: iconProps.iconColor, iconSize: iconProps.iconSize })
    case vmfReserved.drawing:
      return [style, ...(needsVertexLabels ? coordinateLabels(getVertices(feature), resolution, opts) : [])]
    default:
      return [style, ...(needsVertexLabels ? coordinateLabels(getVertices(feature), resolution, opts) : [])]
  }
}

/**
 * Style ol/Features
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

export function textStyle (feature, map, styleText) {
  return function () {
    const opts = {
      store: { map }
    }
    const { rotation } = -feature.get('_vmf_label') || 0 // we need the negative of the rotation due to the way ol works with rotation

    const style = new olStyleStyle({
      geometry: function (feature) {
        return feature.getGeometry()
      },
      text: styleText({
        store: opts.store,
        placement: 'point',
        textAlign: 'left',
        textBaseLine: 'bottom',
        rotation
      }, feature, map.getView().getResolution())
    })

    return style
  }
}

export function getVertices (args) {
  const { feature } = resolveStyleFunctionArgs(args)
  const geometry = feature.getGeometry()

  switch (geometry.getType()) {
    case 'MultiPolygon': {
      const polygons = geometry.getPolygons()
      const vertexArray = polygons.map(polygon => pointsFromVertices(polygon))
      const vertices = vertexArray.reduce((acc, val) => acc.concat(val), [])

      return new olGeomMultiPoint(vertices)
    }
    case 'GeometryCollection': {
      const deepCoords = getCoordinates(geometry)
      const flatCoords = flatten(deepCoords)
      const pairedCoords = pairCoords(flatCoords)

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
      const flatStyles = flatten(componentStyles)

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

export function rotateFeatureArrow (feature, map, rotateIcon) {
  return [
    new olStyleStyle({
      image: new olStyleIcon({
        opacity: 1,
        rotation: -feature.get('angle'),
        anchor: [0.5, 0.5],
        src: `data:image/svg+xml;utf8,${getSVGUri(rotateIcon)}`,
        scale: 4
      }),
      geometry: translateIconGeometry(feature, map),
      zIndex: Infinity
    }),
    new olStyleStyle({
      fill: new olStyleFill({
        color: 'rgb(0, 0, 0, 0)'
      }),
      stroke: new olStyleStroke({
        color: 'rgba(0, 0, 0, 0)',
        width: 1
      }),
      geometry: createRotateIconGeometry(feature, map),
      zIndex: Infinity
    })
  ]
}

export function translateIconGeometry (feature, map) {
  const angle = feature.get('angle')
  const point = feature.getGeometry().clone()

  return translatePoint(point, angle, -0.03, map)
}

export function createRotateIconGeometry (feature, map) {
  const translatedGeometry = translateIconGeometry(feature, map)
  const center = translatedGeometry.getCoordinates()
  const radius = scaleDistanceToMap(15, map)

  return new olGeomCircle(center, radius)
}

export function editingText (feature, map, styleText) {
  return function () {
    const opts = { store: { map } }
    const label = feature.get('_vmf_label')
    const text = getText(label, map.getView().getResolution(), opts)
    const { width: baseTextWidth, fontSize: baseFontSize } = getTextWidth(text, map)
    const textWidth = baseTextWidth * (label.fontSize / baseFontSize)
    const newLabelProps = Object.assign(label, { textWidth })

    feature.set('_vmf_label', newLabelProps, true)

    return new olStyleStyle({
      geometry: function (feature) {
        return feature.getGeometry()
      },
      text: styleText({
        store: opts.store,
        placement: 'point',
        textAlign: 'left',
        textBaseLine: 'bottom',
        rotation: feature.get('_vmf_id').rotation
      }, feature, map.getView().getResolution()),
      image: new olStyleCircle({
        radius: 8,
        fill: new olStyleFill({
          color: 'orange'
        })
      })
    })
  }
}

export function applyMeasureStyle (map, feature, preferences) {
  const safeGetPreference = (key) => preferences?.get?.(key)
  const distanceUOM = safeGetPreference('_DISTANCE_LABEL_UOM')
  const areaUOM = safeGetPreference('_AREA_LABEL_UOM')
  const pointLabels = safeGetPreference('_POINT_LABELS_ENABLED')
  const distanceLabelsEnabled = safeGetPreference('_DISTANCE_LABEL_ENABLED')
  const areaLabelsEnabled = safeGetPreference('_AREA_LABEL_ENABLED')
  const opts = { distanceUOM, areaUOM, map }

  const styleFunc = distanceLabelsEnabled || areaLabelsEnabled || pointLabels
    ? styleMeasure(map, feature, map.getView().getResolution(), opts)
    : undefined

  feature.setStyle(styleFunc)
}
