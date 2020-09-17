import { useEffect } from 'react'
import { connectToContext } from '@bayer/ol-kit'
import { fromLonLat } from 'ol/proj'
import olFeature from 'ol/Feature'
import olVectorLayer from 'ol/layer/Vector'
import olPoint from 'ol/geom/Point'
import olVectorSource from 'ol/source/Vector'
import olStyle from 'ol/style/Style'
import olStroke from 'ol/style/Stroke'
import olFill from 'ol/style/Fill'
import olCircleStyle from 'ol/style/Circle'

function DataLoader (props) {
  const { map } = props
  const dataFetcher = async () => {
    const dataUrl = 'https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/ncov_cases_US/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json'
    const request = await fetch(dataUrl)
    const data = await request.json()
    const features = []

    data.features.forEach(feat => {
      if (feat.geometry) {
        const {x, y} = feat.geometry
        const coords = fromLonLat([x,y])
        const feature = new olFeature(new olPoint(coords))
        const hasConfirmed = feat.attributes.Confirmed > 0
        const color = hasConfirmed > 0 ? 'red' : 'blue'
        const radius = hasConfirmed ? feat.attributes.Confirmed / 1500 : feat.attributes.Confirmed

        feature.setProperties({ ...feat.attributes, title: `Confirmed: ${feat.attributes.Confirmed}` })
        feature.setStyle(
          new olStyle({
            image: new olCircleStyle({
              radius,
              fill: new olFill({ color }),
              stroke: new olStroke({
                color,
                width: 1
              })
            })
          })
        )
        feature.getStyle().getImage().setOpacity(.4)

        features.push(feature)
      }
    })

    const source = new olVectorSource({ features })
    const vectorLayer = new olVectorLayer({ source })

    map.addLayer(vectorLayer)
  }

  useEffect(() => {
    dataFetcher()
  }, [])
  console.log('DATA', map)

  return null
}

export default connectToContext(DataLoader)
