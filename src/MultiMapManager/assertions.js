import * as turfAssert from '@turf/invariant'

export function getValueType (value) {
  if (value instanceof Function) {
    return value.name || 'unknown type name'
  } else if (value instanceof Object) {
    return value.constructor.name || Object.prototype.toString.call(value)
  } else {
    return value === null ? 'null' : typeof value
  }
}

export function assert (condition, message = '') {
  if (!condition) {
    throw new Error(['Assertion failed', message].join(': '))
  }

  return condition
}

export function assertInstanceOf (value, type) {
  assert(value instanceof type, `Expected instanceof ${getValueType(type)} but got ${getValueType(value)}.`)
}

export function mapAssertGet (map, key) {
  assert(map.has(key), `Expected ${map} to have key ${key.toString()}.`)

  return map.get(key)
}

export function coalesce (...values) {
  return values.find((value) => value != null) // eslint-disable-line eqeqeq
}

export function assertArgumentType (argument, type, argumentName, functionName) { // eslint-disable-line max-params
  const message = `${functionName} expected '${argumentName}' to be typeof '${type}' but received '${typeof argument}'`

  return assert(typeof argument === type, message) // eslint-disable-line valid-typeof
}

/**
  param {string, 'collectionOf', 'containsNumber', 'geojsonType', 'featureOf'} assertion
  param {boolean} hard
*/
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
