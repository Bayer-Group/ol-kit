import React, { useEffect } from 'react'
import { connectToMap } from '@bayer/ol-kit'
import proj from 'ol/proj'
import olFeature from 'ol/feature'
import olVectorLayer from 'ol/layer/vector'
import olPoint from 'ol/geom/point'
import olVectorSource from 'ol/source/vector'
import olStyle from 'ol/style/style'
import olStroke from 'ol/style/stroke'
import olFill from 'ol/style/fill'
import olCircleStyle from 'ol/style/circle'

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
        const coords = proj.fromLonLat([x,y])
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

export default connectToMap(DataLoader)
