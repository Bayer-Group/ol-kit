import debounce from 'lodash.debounce'

/**
 * Bind multiple move listeners with the same callback
 * @function
 * @since 5.0.0
 * @param {ol.Map} map - The openlayers map to which the events are bound
 * @param {Function} callback - The callback invoked when a `change:size`, `change:resolution` or a `change:center` event was fired
 * @param {Object} [thisObj] - The object to use as `this` in the event listeners.
 * @returns {ol.EventsKey[]} Array of openlayers event keys for unsetting listener events (See: https://openlayers.org/en/v4.6.5/apidoc/ol.Observable.html#.unByKey)
 */
export const addMovementListener = (map, callback, thisObj) => {
    if (typeof callback !== 'function') return console.error('addMovementListener requires a valid openlayers map & callback function') // eslint-disable-line

  // If performance becomes an issue with catalog layers & far zoom level, these debounce levels can be adjusted
  const slowDebounce = debounce(callback, 0)
  const fastDebounce = debounce(callback, 0)

  const keys = [
    map.on('change:size', slowDebounce, thisObj),
    map.getView().on('change:resolution', slowDebounce, thisObj),
    map.getView().on('change:center', fastDebounce, thisObj)
  ]

  return keys
}
