/* eslint-disable */
import olFeature from 'ol/Feature'
import olVectorLayer from 'ol/layer/Vector'
import olPoint from 'ol/geom/Point'
import olClusterSource from 'ol/source/Cluster'
import olVectorSource from 'ol/source/Vector'
import olStyle from 'ol/style/Style'
import olText from 'ol/style/Text'
import olFill from 'ol/style/Fill'
import olStroke from 'ol/style/Stroke'
import olCircle from 'ol/style/Circle'
import { createMap } from 'Map'
import { getLayersAndFeaturesForEvent, sanitizeProperties } from 'Popup'

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
      const random = i+ 1
      var coordinates = [2 * e * random - e, 2 * e * random - e]
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

    const featureCoords = clusters.getSource().getSource().getFeatures()[0].getGeometry().getCoordinates()
    const clickPixel = map.getPixelFromCoordinate(featureCoords)

    const event = { map, pixel: [0,0] }
    const promises = await getLayersAndFeaturesForEvent(event)

    expect(2).toBe(1)
  })

  it('should sanitize properties', () => {
    const properties = {
      key: 'value',
      _ol_kit_key: 'this should not show up',
      geom: {},
      geometry: () => {},
      goodKey: 'goodValue',
      boolean: true,
      falsy: null,
      _ol_kit_ignore: null,
      coordinates: 'x: -10129853.25, y: 5312160.22'
    }
    const expected = {
      key: 'value',
      goodKey: 'goodValue',
      boolean: true,
      coordinates: 'x: -10129853.25, y: 5312160.22',
      falsy: null
    }

    expect(sanitizeProperties(properties)).toEqual(expected)
  })
})
