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
  FullScreenFlex,
  SplitScreen,
} from '@bayer/ol-kit'
import { fromLonLat } from 'ol/proj'
import olFeature from 'ol/Feature'
import olGeomPoint from 'ol/geom/Point'
import olSourceVector from 'ol/source/Vector'

class App extends React.Component {
  mapConfigs = [
    {
      id: 'map0',
      synced: true,
      visible: true
    },
    {
      id: 'map1',
      synced: false,
      visible: false
    },
    {
      id: 'map2',
      synced: false,
      visible: false
    },
    {
      id: 'map3',
      synced: false,
      visible: false
    },
  ]

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
  }

  render () {
    return (
      <MultiMapManager>
        <div style={{position: 'absolute', top: 20, left: 20, zIndex: 1, }}>
          <SplitScreen />
        </div>
        <FullScreenFlex>
          {this.mapConfigs.map(({ id, synced, visible }, i, array) => {
            return (
              <Map id={id} onMapInit={this.onMapInit} synced={synced} visible={visible} isMultiMap>
                <Popup />
                <ContextMenu />
                <Controls />
                <BasemapContainer />
              </Map>
            )
          })}
        </FullScreenFlex>
      </MultiMapManager>
    )
  }
}

export default App
