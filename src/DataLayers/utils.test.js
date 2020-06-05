import { loadDataLayer } from './utils'
import { VectorLayer } from 'classes'
import { createMap } from 'Map'
import proj from 'ol/proj'

const STL_COORD = proj.fromLonLat([-90.4994, 38.6270])

describe('loadDataLayer', () => {
  global.document.body.innerHTML = '<div id="map"></div>'

  it('loadDataLayer should throw error for bad query', async () => {
    const map = createMap({ target: 'map' })

    try {
      await loadDataLayer(map, 'bad-string')
      expect(true).toBe(false) // this should never be hit due to error above
    } catch (e) {
      expect(e.message).toBe('\'loadDataLayer\' recieved invalid query: \'bad-string\' as second argument')
    }
  })

  it('loadDataLayer should load valid geoJson file', async () => {
    const map = createMap({ target: 'map' })
    const dataLayer = await loadDataLayer(map, require('./__test_data__/us_states.json'))
    const layers = map.getLayers().getArray()

    expect(layers.length).toBe(2)
    // should return a VectorLayer
    expect(dataLayer instanceof VectorLayer).toBe(true)
    // data layer should be added to map
    expect(layers[1]).toBe(dataLayer)
    // 52 us states/territories
    expect(layers[1].getSource().getFeatures().length).toBe(52)
    // properties should be passed to features (there are 6 from the geoJson)
    expect(Object.keys(layers[1].getSource().getFeatures()[0].getProperties()).length).toBe(6)
    // get missouri feature
    expect(dataLayer.getSource().getFeaturesAtCoordinate(STL_COORD).length).toBe(1)
    expect(dataLayer.getSource().getFeaturesAtCoordinate(STL_COORD)[0].get('NAME')).toBe('Missouri')
  })

  it('loadDataLayer should load valid geoJson file, but not add to the map', async () => {
    const map = createMap({ target: 'map' })
    const opts = { addToMap: false }
    const dataLayer = await loadDataLayer(map, require('./__test_data__/us_states.json'), opts)
    const layers = map.getLayers().getArray()

    // only the basemap should be added to map
    expect(layers.length).toBe(1)
    // should return a VectorLayer
    expect(dataLayer instanceof VectorLayer).toBe(true)
    // data layer should NOT be added to map
    expect(layers[0]).not.toBe(dataLayer)
    // 52 us states/territories
    expect(dataLayer.getSource().getFeatures().length).toBe(52)
    // properties should be passed to features (there are 6 from the geoJson)
    expect(Object.keys(dataLayer.getSource().getFeatures()[0].getProperties()).length).toBe(6)
    // get missouri feature
    expect(dataLayer.getSource().getFeaturesAtCoordinate(STL_COORD).length).toBe(1)
    expect(dataLayer.getSource().getFeaturesAtCoordinate(STL_COORD)[0].get('NAME')).toBe('Missouri')
  })

  it.skip('loadDataLayer should load valid geoJson endpoint', async () => {
    const map = createMap({ target: 'map' })
    const dataLayer = await loadDataLayer(map, 'https://opendata.arcgis.com/datasets/628578697fb24d8ea4c32fa0c5ae1843_0.geojson')
    const layers = map.getLayers().getArray()

    expect(layers.length).toBe(2)
    // should return a VectorLayer
    expect(dataLayer instanceof VectorLayer).toBe(true)
    // data layer should be added to map
    expect(layers[1]).toBe(dataLayer)
    // 52 us states/territories
    expect(layers[1].getSource().getFeatures().length).toBe(52)
    // properties should be passed to features (there are 6 from the geoJson)
    expect(Object.keys(layers[1].getSource().getFeatures()[0].getProperties()).length).toBe(6)
    // get missouri feature
    expect(dataLayer.getSource().getFeaturesAtCoordinate(STL_COORD).length).toBe(1)
    expect(dataLayer.getSource().getFeaturesAtCoordinate(STL_COORD)[0].get('NAME')).toBe('Missouri')
  })

  it.skip('loadDataLayer should load valid kml file', async () => {
    const map = createMap({ target: 'map' })
    // need to allow import of kml files via babel
    const dataLayer = await loadDataLayer(map, require('./__test_data__/polygon.kml'))
    const layers = map.getLayers().getArray()

    expect(layers.length).toBe(2)
    // should return a VectorLayer
    expect(dataLayer instanceof VectorLayer).toBe(true)
    // data layer should be added to map
    expect(layers[1]).toBe(dataLayer)

    console.log('data:', dataLayer)
  })

  it.skip('loadDataLayer should load valid kml endpoint', async () => {
    const map = createMap({ target: 'map' })
    const data = 'https://bloomington.in.gov/geoserver/publicgis/wms/kml?layers=publicgis:TrailsAndPaths'
    // need jest to allow fetch
    const dataLayer = await loadDataLayer(map, 'https://data.nasa.gov/api/geospatial/7zbq-j77a?method=export&format=KML')
    const layers = map.getLayers().getArray()

    expect(layers.length).toBe(2)
    // should return a VectorLayer
    expect(dataLayer instanceof VectorLayer).toBe(true)
    // data layer should be added to map
    expect(layers[1]).toBe(dataLayer)

    console.log('data:', dataLayer)
  })
})
