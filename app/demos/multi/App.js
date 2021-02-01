import React from 'react'
import {
  Map,
  Popup,
  TabbedPanel,
  Controls,
  ContextMenu,
  loadDataLayer,
  LayerStyler,
  LayerPanelLayersPage,
  MultiMapManager,
  TabbedPanelPage,
  BasemapContainer,
  VectorLayer,
  DrawContainer,
  FlexMap,
  createMap
} from '@bayer/ol-kit'
import { fromLonLat } from 'ol/proj'
import olFeature from 'ol/Feature'
import olGeomPoint from 'ol/geom/Point'
import olSourceVector from 'ol/source/Vector'

import Welcome from '../../Welcome'

class App extends React.Component {
  state = {
    multiMapConfig: {}
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

  componentDidMount () {
    const multiMapConfig = {
      map0: createMap({ target: 'map0' }),
      map1: createMap({ target: 'map1' }),
      map2: createMap({ target: 'map2' }),
      map3: createMap({ target: 'map3' }),
      map4: createMap({ target: 'map4' }),
      map5: createMap({ target: 'map5' }),
      map6: createMap({ target: 'map6' }),
      map7: createMap({ target: 'map7' }),
    }

    this.setState({ multiMapConfig })
  }

  render () {
    const { multiMapConfig } = this.state
    const entries = Object.entries(multiMapConfig)
    console.log('APP RENDER')
    
    return (
      <MultiMapManager multiMapConfig={multiMapConfig} groups={[['map0', 'map1'],['map2', 'map3']]}>
        {entries.map(([key, map], i) => {
          return (
            <FlexMap key={key}>
              <Map _ol_kit_multi={true}>
                {/* <MapLogo /> */}
              </Map>
            </FlexMap>
          )
        })}
        <div>yay multi maps</div>
      </MultiMapManager>
      // <Map onMapInit={this.onMapInit} fullScreen>
      //   <Popup />
      //   <TabbedPanel>
      //     <TabbedPanelPage tabIcon='Home'>
      //       <Welcome />
      //     </TabbedPanelPage>
      //     <TabbedPanelPage label='Layers'>
      //       <LayerPanelLayersPage />
      //     </TabbedPanelPage>
      //     <TabbedPanelPage label='Styles'>
      //       <LayerStyler />
      //     </TabbedPanelPage>
      //     <TabbedPanelPage label='Draw'>
      //       <DrawContainer style={{ position: 'relative', width: 'auto' }} />
      //     </TabbedPanelPage>
      //   </TabbedPanel>
      //   <ContextMenu />
      //   <Controls />
      //   <BasemapContainer />
      // </Map>
    )
  }
}

export default App
