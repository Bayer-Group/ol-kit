import olFormatWFS from 'ol/format/wfs'
import * as olXML from 'ol/xml'
import * as olFormatXSD from 'ol/format/xsd'
import asserts from 'ol/asserts'
import olFormatFilter from 'ol/format/filter'
import GMLBase from 'ol/format/gmlbase'
import GML3 from 'ol/format/GML3'
console.log(olXML)
/**
 * @type {string}
 */
const OGCNS = 'http://www.opengis.net/ogc'

/**
 * @type {string}
 */
const FEATURE_PREFIX = 'feature'

/**
 * @type {string}
 */
const XMLNS = 'http://www.w3.org/2000/xmlns/'

/**
 * @type {string}
 */
const FESNS = 'http://www.opengis.net/fes'

const QUERY_SERIALIZERS = {
  'http://www.opengis.net/wfs': {
    'PropertyName': olXML.makeChildAppender(olFormatXSD.writeStringTextNode)
  }
}

class CustomWFSFormat extends olFormatWFS {
  /**
   * Encode format as WFS `GetFeature` and return the Node.
   *
   * @param {WriteGetFeatureOptions} options Options.
   * @return {Node} Result.
   * @api
   */
  writeGetFeature (options) {
    // const result = super.writeGetFeature(options)

    // console.log(result) // eslint-disable-line no-console

    // return result
    const node = olXML.createElementNS('http://www.opengis.net/wfs', 'GetFeature')

    node.setAttribute('service', 'WFS')
    node.setAttribute('version', '1.1.0')
    let filter

    if (options) {
      if (options.handle) {
        node.setAttribute('handle', options.handle)
      }
      if (options.outputFormat) {
        node.setAttribute('outputFormat', options.outputFormat)
      }
      if (options.maxFeatures !== undefined) {
        node.setAttribute('maxFeatures', String(options.maxFeatures))
      }
      if (options.resultType) {
        node.setAttribute('resultType', options.resultType)
      }
      if (options.startIndex !== undefined) {
        node.setAttribute('startIndex', String(options.startIndex))
      }
      if (options.count !== undefined) {
        node.setAttribute('count', String(options.count))
      }
      if (options.viewParams !== undefined) {
        node.setAttribute('viewParams', options.viewParams)
      }
      filter = options.filter
      if (options.bbox) {
        asserts.assert(options.geometryName, 12) // `options.geometryName` must also be provided when `options.bbox` is set
        const bbox = olFormatFilter.bbox(
          /** @type {string} */ (options.geometryName), options.bbox, options.srsName)

        if (filter) {
          // if bbox and filter are both set, combine the two into a single filter
          filter = olFormatFilter.and(filter, bbox)
        } else {
          filter = bbox
        }
      }
    }
    node.setAttributeNS('http://www.w3.org/2001/XMLSchema-instance', 'xsi:schemaLocation', this.schemaLocation_)
    const context = { node: node }

    Object.assign(context, {
      'srsName': options.srsName,
      'featureNS': options.featureNS ? options.featureNS : this.featureNS_,
      'featurePrefix': options.featurePrefix,
      'geometryName': options.geometryName,
      'filter': filter,
      'propertyNames': options.propertyNames ? options.propertyNames : []
    })

    // assert(Array.isArray(options.featureTypes), 11) // `options.featureTypes` should be an Array
    writeGetFeature(node, /** @type {!Array<string>} */ (options.featureTypes), [context], this)

    return node
  }
}

/**
 * @param {Node} node Node.
 * @param {ol.format.filter.IsLike} filter Filter.
 * @param {Array.<*>} objectStack Node stack.
 * @private
 */
function writeIsLikeFilter (node, filter, objectStack) {
  node.setAttribute('wildCard', filter.wildCard)
  node.setAttribute('singleChar', filter.singleChar)
  node.setAttribute('escapeChar', filter.escapeChar)
  if (filter.matchCase !== undefined) {
    node.setAttribute('matchCase', filter.matchCase.toString())
  }
  if (typeof filter.propertyName === 'string') {
    writeOgcPropertyName(node, filter.propertyName)
  } else {
    const child = olXML.createElementNS(OGCNS, 'Function')

    child.setAttribute('name', filter.propertyName.name)
    writeOgcLiteral(child, `${filter.propertyName.expression}`)
    writeOgcPropertyName(child, filter.propertyName.propertyName)
    node.appendChild(child)
  }
  writeOgcLiteral(node, `${filter.pattern}`)
}

/**
 * @param {string} tagName Tag name.
 * @param {Node} node Node.
 * @param {string} value Value.
 */
function writeOgcExpression (tagName, node, value) {
  const property = olXML.createElementNS(OGCNS, tagName)

  olFormatXSD.writeStringTextNode(property, value)
  node.appendChild(property)
}

/**
 * @param {Node} node Node.
 * @param {string} value PropertyName value.
 */
function writeOgcPropertyName (node, value) {
  writeOgcExpression('PropertyName', node, value)
}

/**
 * @param {Node} node Node.
 * @param {string} value PropertyName value.
 */
function writeOgcLiteral (node, value) {
  writeOgcExpression('Literal', node, value)
}

/**
 * @param {Node} node Node.
 * @param {Array<string>} featureTypes Feature types.
 * @param {Array<*>} objectStack Node stack.
 */
function writeGetFeature (node, featureTypes, objectStack) {
  const context = (objectStack[objectStack.length - 1])
  const item = (Object.assign({}, context))

  item.node = node
  olXML.pushSerializeAndPop(item,
    GETFEATURE_SERIALIZERS,
    olXML.makeSimpleNodeFactory('Query'), featureTypes,
    objectStack)
}

/**
 * @param {string|undefined} featurePrefix The prefix of the feature.
 * @param {string} featureType The type of the feature.
 * @returns {string} The value of the typeName property.
 */
function getTypeName (featurePrefix = FEATURE_PREFIX, featureType) {
  const prefix = `${featurePrefix}:`

  // The featureType already contains the prefix.
  if (featureType.indexOf(prefix) === 0) {
    return featureType
  } else {
    return prefix + featureType
  }
}

function writeFilterCondition (node, filter, objectStack) {
  const item = { node: node }

  olXML.pushSerializeAndPop(item,
    GETFEATURE_SERIALIZERS,
    olXML.makeSimpleNodeFactory(filter.getTagName()),
    [filter], objectStack)
}

/**
 * @param {Element} node Node.
 * @param {string} featureType Feature type.
 * @param {Array<*>} objectStack Node stack.
 */
function writeQuery (node, featureType, objectStack) {
  const context = /** @type {Object} */ (objectStack[objectStack.length - 1])
  const featurePrefix = context['featurePrefix'] // eslint-disable-line
  const featureNS = context['featureNS'] // eslint-disable-line
  const propertyNames = context['propertyNames'] // eslint-disable-line
  const srsName = context['srsName'] // eslint-disable-line

  let typeName

  // If feature prefix is not defined, we must not use the default prefix.
  if (featurePrefix) {
    typeName = getTypeName(featurePrefix, featureType)
  } else {
    typeName = featureType
  }
  node.setAttribute('typeName', typeName)
  if (srsName) {
    node.setAttribute('srsName', srsName)
  }
  if (featureNS) {
    node.setAttributeNS(XMLNS, `xmlns:${featurePrefix}`, featureNS)
  }
  const item = (Object.assign({}, context))

  item.node = node
  olXML.pushSerializeAndPop(item,
    QUERY_SERIALIZERS,
    olXML.makeSimpleNodeFactory('PropertyName'), propertyNames,
    objectStack)
  const filter = context['filter'] // eslint-disable-line

  if (filter) {
    const child = olXML.createElementNS(OGCNS, 'Filter')

    node.appendChild(child)
    writeFilterCondition(child, filter, objectStack)
  }
}

function writeTimeInstant (node, time) {
  const timeInstant = olXML.createElementNS(GMLBase.GMLNS, 'TimeInstant')

  node.appendChild(timeInstant)

  const timePosition = olXML.createElementNS(GMLBase.GMLNS, 'timePosition')

  timeInstant.appendChild(timePosition)
  olFormatXSD.writeStringTextNode(timePosition, time)
}

function writeDuringFilter (node, filter, objectStack) {
  const valueReference = olXML.createElementNS(FESNS, 'ValueReference')

  olFormatXSD.writeStringTextNode(valueReference, filter.propertyName)
  node.appendChild(valueReference)

  const timePeriod = olXML.createElementNS(GMLBase.GMLNS, 'TimePeriod')

  node.appendChild(timePeriod)

  const begin = olXML.createElementNS(GMLBase.GMLNS, 'begin')

  timePeriod.appendChild(begin)
  writeTimeInstant(begin, filter.begin)

  const end = olXML.createElementNS(GMLBase.GMLNS, 'end')

  timePeriod.appendChild(end)
  writeTimeInstant(end, filter.end)
}

function writeLogicalFilter (node, filter, objectStack) {
  const item = { node: node }
  const conditions = filter.conditions

  for (let i = 0, ii = conditions.length; i < ii; ++i) {
    const condition = conditions[i]

    olXML.pushSerializeAndPop(item,
      GETFEATURE_SERIALIZERS,
      olXML.makeSimpleNodeFactory(condition.getTagName()),
      [condition], objectStack)
  }
}

function writeNotFilter (node, filter, objectStack) {
  const item = { node: node }
  const condition = filter.condition

  olXML.pushSerializeAndPop(item,
    GETFEATURE_SERIALIZERS,
    olXML.makeSimpleNodeFactory(condition.getTagName()),
    [condition], objectStack)
}

function writeBboxFilter (node, filter, objectStack) {
  const context = objectStack[objectStack.length - 1]

  context['srsName'] = filter.srsName // eslint-disable-line
  writeOgcPropertyName(node, filter.geometryName)
  GML3.prototype.writeGeometryElement(node, filter.extent, objectStack)
}

function writeContainsFilter (node, filter, objectStack) {
  const context = objectStack[objectStack.length - 1]

  context['srsName'] = filter.srsName // eslint-disable-line
  writeOgcPropertyName(node, filter.geometryName)
  GML3.prototype.writeGeometryElement(node, filter.geometry, objectStack)
}

function writeIntersectsFilter (node, filter, objectStack) {
  const context = objectStack[objectStack.length - 1]

  context['srsName'] = filter.srsName // eslint-disable-line
  writeOgcPropertyName(node, filter.geometryName)
  GML3.prototype.writeGeometryElement(node, filter.geometry, objectStack)
}

function writeWithinFilter (node, filter, objectStack) {
  const context = objectStack[objectStack.length - 1]

  context['srsName'] = filter.srsName // eslint-disable-line
  writeOgcPropertyName(node, filter.geometryName)
  GML3.prototype.writeGeometryElement(node, filter.geometry, objectStack)
}

function writeComparisonFilter (node, filter, objectStack) {
  if (filter.matchCase !== undefined) {
    node.setAttribute('matchCase', filter.matchCase.toString())
  }
  writeOgcPropertyName(node, filter.propertyName)
  writeOgcLiteral(node, `${filter.expression}`)
}

function writeIsNullFilter (node, filter, objectStack) {
  writeOgcPropertyName(node, filter.propertyName)
}

function writeIsBetweenFilter (node, filter, objectStack) {
  writeOgcPropertyName(node, filter.propertyName)

  const lowerBoundary = olXML.createElementNS(OGCNS, 'LowerBoundary')

  node.appendChild(lowerBoundary)
  writeOgcLiteral(lowerBoundary, `${filter.lowerBoundary}`)

  const upperBoundary = olXML.createElementNS(OGCNS, 'UpperBoundary')

  node.appendChild(upperBoundary)
  writeOgcLiteral(upperBoundary, `${filter.upperBoundary}`)
}

const GETFEATURE_SERIALIZERS = {
  'http://www.opengis.net/wfs': {
    'Query': olXML.makeChildAppender(writeQuery)
  },
  'http://www.opengis.net/ogc': {
    'During': olXML.makeChildAppender(writeDuringFilter),
    'And': olXML.makeChildAppender(writeLogicalFilter),
    'Or': olXML.makeChildAppender(writeLogicalFilter),
    'Not': olXML.makeChildAppender(writeNotFilter),
    'BBOX': olXML.makeChildAppender(writeBboxFilter),
    'Contains': olXML.makeChildAppender(writeContainsFilter),
    'Intersects': olXML.makeChildAppender(writeIntersectsFilter),
    'Within': olXML.makeChildAppender(writeWithinFilter),
    'PropertyIsEqualTo': olXML.makeChildAppender(writeComparisonFilter),
    'PropertyIsNotEqualTo': olXML.makeChildAppender(writeComparisonFilter),
    'PropertyIsLessThan': olXML.makeChildAppender(writeComparisonFilter),
    'PropertyIsLessThanOrEqualTo': olXML.makeChildAppender(writeComparisonFilter),
    'PropertyIsGreaterThan': olXML.makeChildAppender(writeComparisonFilter),
    'PropertyIsGreaterThanOrEqualTo': olXML.makeChildAppender(writeComparisonFilter),
    'PropertyIsNull': olXML.makeChildAppender(writeIsNullFilter),
    'PropertyIsBetween': olXML.makeChildAppender(writeIsBetweenFilter),
    'PropertyIsLike': olXML.makeChildAppender(writeIsLikeFilter)
  }
}

export default CustomWFSFormat
