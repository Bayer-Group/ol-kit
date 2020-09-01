import wktFormat from 'ol/format/wkt'

/**
 * Convert a feature to a WKT string
 * @function
 * @category PopupActionCopyWkt
 * @param {Object} feature - An ol/Feature 
 * @param {Number} [decimalPlaces] - the number of decimal places in the output coordinates
 * @returns {String} The WKT string of the feature passed
 */
export const convertFeatureToWkt = (feature, decimalPlaces) => {
  const format = new wktFormat()
  return format.writeFeature(feature, {
    dataProjection: 'EPSG:4326',
    featureProjection: 'EPSG:3857',
    decimals: decimalPlaces
  })
}

/**
 * Copy text to the clipboard
 * @function
 * @category PopupActionCopyWkt
 * @param {String} text - The string to copy to the system clipboard
 */
export const copyTextToClipboard = text => {
  const el = document.createElement('textarea')
  el.value = text
  document.body.appendChild(el)
  el.select()
  document.execCommand('copy')
  document.body.removeChild(el)
}

/**
 * Given an ol/Feature, copy its WKT string to the system clipboard
 * @function
 * @category PopupActionCopyWkt
 * @param {Object} feature - An ol/Feature 
 * @param {Number} [decimalPlaces] - the number of decimal places in the output coordinates
 */
export const copyWktToClipbard = (feature, decimalPlaces) => {
  copyTextToClipboard(convertFeatureToWkt(feature, decimalPlaces))
}