/* eslint-disable */
import olFeature from 'ol/feature'
import olVectorLayer from 'ol/layer/vector'
import olPoint from 'ol/geom/point'
import olClusterSource from 'ol/source/cluster'
import olVectorSource from 'ol/source/vector'
import olStyle from 'ol/style/style'
import olText from 'ol/style/text'
import olFill from 'ol/style/fill'
import olStroke from 'ol/style/stroke'
import olCircle from 'ol/style/circle'
import { createMap } from 'Map'
import { getLayersAndFeaturesForEvent } from 'Popup'

describe('Popup utils', () => {
  global.document.body.innerHTML = '<div id="map"></div>'

  it.skip('should get features for cluster source', async () => {
    const map = createMap({ target: 'map' })

    // taken from ol example: https://openlayers.org/en/v4.6.5/examples/cluster.html
    // START EXAMPLE
    var distance = { value: '40' }
    var count = 20000
    var features = new Array(count)
    var e = 4500000
    for (var i = 0; i < count; ++i) {
      var coordinates = [2 * e * Math.random() - e, 2 * e * Math.random() - e]
      features[i] = new olFeature(new olPoint(coordinates))
    }
    var source = new olVectorSource({
      features: features
    })

    var clusterSource = new olClusterSource({
      distance: parseInt(distance.value, 10),
      source: source
    })

    var styleCache = {}
    var clusters = new olVectorLayer({
      source: clusterSource,
      style: function(feature) {
        var size = feature.get('features').length
        var style = styleCache[size]
        if (!style) {
          style = new olStyle({
            image: new olCircle({
              radius: 10,
              stroke: new olStroke({
                color: '#fff'
              }),
              fill: new olFill({
                color: '#3399CC'
              })
            }),
            text: new olText({
              text: size.toString(),
              fill: new olFill({
                color: '#fff'
              })
            })
          })
          styleCache[size] = style
        }
        return style
      }
    })
    // END EXAMPLE

    map.addLayer(clusters)

    console.log(clusters.getSource().get('features'))

    const event = { map, pixel: [0,0] }
    const promises = await getLayersAndFeaturesForEvent(event)

    expect(2).toBe(1)
  })
})
