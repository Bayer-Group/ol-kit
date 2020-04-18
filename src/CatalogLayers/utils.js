import olVectorLayer from 'ol/layer/vector'
import olVectorSource from 'ol/source/vector'
import olStyle from 'ol/style/style'
import olFill from 'ol/style/fill'
import olStroke from 'ol/style/stroke'
import proj from 'ol/proj'
import GeoJSON from 'ol/format/geojson'
import KML from 'ol/format/kml'
import ugh from 'ugh'

const getFeatures = arg => {
  try {
    const dataSet = require(`../../data/${arg}.json`)
    const geoJson = new GeoJSON({ featureProjection: 'EPSG:3857'}) // TODO check map projection
    const features = geoJson.readFeatures(dataSet)

    return features
  } catch (e) {
    // must not be JSON
    ugh.error(e)
  }

  try {
    const dataSet = require(`../../data/${arg}.xml`)
    const kml = new KML()
    const features = kml.readFeatures(dataSet)

    return features
  } catch (e) {
    // not kml either
    ugh.error(e)
  }

  // all failures, return empty array
  return []
}

export const createDataLayer = (arg, styleArg) => {
  const style = { fill: { color: '#7FDBFF33' }, stroke: { color: '#0074D9', width: 2 }, ...styleArg}
  const features = getFeatures(arg)
  const layer = new olVectorLayer({ source: new olVectorSource() })
  const source = layer.getSource()

  features.forEach((feature, i) => {
    const { properties } = feature

    source.addFeature(feature)
  })

  // layer.setStyle(
  //   new olStyle({
  //     fill: new olFill(style.fill),
  //     stroke: new olStroke(style.stroke)
  //   })
  // )

  return layer
}

export const addDataLayer = async (map, arg, style) => {
  const layer = createDataLayer()

  return layer
}
