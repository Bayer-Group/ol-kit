import wktFormat from 'ol/format/wkt'

export const convertFeatureToWkt = (feature, decimalPlaces) => {
  const format = new wktFormat()
  return format.writeFeature(feature, {
    dataProjection: 'EPSG:4326',
    featureProjection: 'EPSG:3857',
    decimals: decimalPlaces
  })
}

export const copyTextToClipboard = text => {
  const el = document.createElement('textarea')
  el.value = text
  document.body.appendChild(el)
  el.select()
  document.execCommand('copy')
  document.body.removeChild(el)
}

export const copyWktToClipbard = (feature, decimalPlaces) => {
  copyTextToClipboard(convertFeatureToWkt(feature, decimalPlaces))
}