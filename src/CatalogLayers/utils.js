import olFeature from 'ol/feature'
import olVectorLayer from 'ol/layer/vector'
import olVectorSource from 'ol/source/vector'
import olPolygon from 'ol/geom/polygon'
import olMultiPolygon from 'ol/geom/multipolygon'
import olStyle from 'ol/style/style'
import olFill from 'ol/style/fill'
import olStroke from 'ol/style/stroke'
import proj from 'ol/proj'

import US_STATES from './data/us_states.json'

export const createUSStatesLayer = () => {
  const layer = new olVectorLayer({ source: new olVectorSource() })
  const source = layer.getSource()

  US_STATES.features.forEach(state => {
    const { geometry, properties } = state
    const coords = geometry.type === 'MultiPolygon'
      ? geometry.coordinates.map(c => c.map(c => c.map(c => proj.fromLonLat(c)))) // eslint-disable-line max-nested-callbacks
      : geometry.coordinates.map(c => c.map(c => proj.fromLonLat(c)))
    const olGeom = geometry.type === 'MultiPolygon'
      ? new olMultiPolygon(coords)
      : new olPolygon(coords)
    const feature = new olFeature({ geometry: olGeom })

    layer.setStyle(
      new olStyle({
        fill: new olFill({ color: '#7FDBFF33' }),
        stroke: new olStroke({
          color: '#0074D9', width: 2
        })
      })
    )
    feature.setProperties({ ...properties, title: properties.NAME })
    source.addFeature(feature)
  })

  return layer
}
