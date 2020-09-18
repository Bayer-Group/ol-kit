import { connectToContext, VectorLayer } from '@bayer/ol-kit'
import olSourceVector from 'ol/source/Vector'
import olFeature from 'ol/Feature'
import olGeomPoint from 'ol/geom/Point'
import { fromLonLat } from 'ol/proj'
import olStyle from 'ol/style/Style'
import olStroke from 'ol/style/Stroke'
import olIcon from 'ol/style/Icon'

function ISS (props) {
  const { map } = props

  const layer = new VectorLayer({
    title: 'ISS Tracker',
    source: new olSourceVector({ features: [] }),
    // _ol_kit_time_key: 'time'
  })

  setInterval(async () => {
    const data = await fetch('http://api.open-notify.org/iss-now.json')
    const res = await data.json()
    const lonLat = [Number(res.iss_position.longitude), Number(res.iss_position.latitude)]

    const iconStyle = new olStyle({
      stroke: new olStroke(),
        image: new olIcon({
        opacity: 1,
        src: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/International_Space_Station.svg',
        scale: .05
      })
    })
    const feature = new olFeature({
      geometry: new olGeomPoint(fromLonLat(lonLat))
    })

    feature.setStyle(iconStyle)
    feature.set('time', new Date().toString())
    feature.set('latitude', lonLat[1])
    feature.set('longitude', lonLat[0])

    layer.getSource().addFeature(feature)
  }, 2000)

  map.addLayer(layer)

  return null
}

export default connectToContext(ISS)
