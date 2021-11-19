import React from 'react'
import {
  Map,
  Popup,
  Controls,
  ContextMenu,
  loadDataLayer,
  MultiMapManager,
  BasemapContainer,
  VectorLayer,
  FlexMap,
  FullScreenFlex,
  SplitScreen,
  SyncableMap
} from '@bayer/ol-kit'
import { fromLonLat } from 'ol/proj'
import olFeature from 'ol/Feature'
import olGeomPoint from 'ol/geom/Point'
import olSourceVector from 'ol/source/Vector'
import olView from 'ol/View'

class App extends React.Component {
  constructor () {
    super()

    const mapKeys = [
      'map0',
      'map1',
      'map2',
      'map3',
      'map4',
      'map5',
      'map6',
      'map7',
    ]

    this.maps = mapKeys.map((target, i) => {
      return new SyncableMap({
        target,
        controls: [],
        renderer: 'canvas',
        view: new olView({
          projection: 'EPSG:3857',
          center: [-11000000, 4600000],
          zoom: 4
        }),
        // Only show the first map
        visible: i === 0,
        synced: i === 0
      })
    })
  }
  onMapInit = async (map) => {
    // create a vector layer and add to the map
    const layer = new VectorLayer({
      title: '1904Labs HQ',
      source: new olSourceVector({
        features: [new olFeature({
          feature_type: ['1904Labs HQ'],
          title: '1904Labs HQ',
          name: '1904Labs HQ',
          geometry: new olGeomPoint(fromLonLat([-90.24618, 38.636069]))
        })]
      })
    })

    map.addLayer(layer)

    const dataLayer = await loadDataLayer(map, 'https://data.nasa.gov/api/geospatial/7zbq-j77a?method=export&format=KML')

    dataLayer.getSource().getFeatures().forEach(f => f.set('title', f.get('name')))

    window.map = map
  }

  render () {
    return (
      <MultiMapManager groups={[['map0', 'map1'],['map2', 'map3']]}>
        <FullScreenFlex>
          {this.maps.map((map, i, array) => {
            return (
              <FlexMap
                key={map.getTargetElement().id}
                index={i}
                total={array.length}
                numberOfRows={2}
                numberOfColumns={4}>
                <Map map={map} onMapInit={this.onMapInit} isMultiMap>
                  {/* <SplitScreen /> */}
                  <Popup />
                  <ContextMenu />
                  <Controls />
                  <BasemapContainer />
                </Map>
              </FlexMap>
            )
          })}
        </FullScreenFlex>
      </MultiMapManager>
    )
  }
}

export default App
