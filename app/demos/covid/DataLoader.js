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

    // creating a features array which will ultimately be drawn on the map once we make sense of it
    const features = []

    // iterating over the dataset we just got
    data.features.forEach(feat => {
      if (feat.geometry) {
        const {x, y} = feat.geometry

        // Converts coordinates from the data to a projection that our map can understand. Read more here: https://openlayers.org/en/latest/apidoc/module-ol_proj.html
        const coords = fromLonLat([x,y])

        // Creates an ol feature using the coordinates above
        const feature = new olFeature(new olPoint(coords))

        // Figuring out how big of a circle we need to draw on the map
        const hasConfirmed = feat.attributes.Confirmed > 0
        const color = hasConfirmed > 0 ? 'red' : 'blue'
        const radius = hasConfirmed ? feat.attributes.Confirmed / 1500 : feat.attributes.Confirmed

        // adding additional metadate to the points, this makes it visible in the popup details tab
        feature.setProperties({ ...feat.attributes, title: `Confirmed: ${feat.attributes.Confirmed}` })

        // Feature styling. Check it out here: https://openlayers.org/en/latest/apidoc/module-ol_Feature-Feature.html#setStyle
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

        // add to the features array
        features.push(feature)
      }
    })

    const source = new olVectorSource({ features })
    const vectorLayer = new olVectorLayer({ source })

    map.addLayer(vectorLayer)
  }

  // Similar to componentDidMount and componentDidUpdate
  // More info about Hooks here https://reactjs.org/docs/hooks-effect.html
  useEffect(() => {
    dataFetcher()
  }, [])

  return null
}

// Wrapping DataLoader with connectToContext gives us the ability to recieve a reference to the map
export default connectToContext(DataLoader)
