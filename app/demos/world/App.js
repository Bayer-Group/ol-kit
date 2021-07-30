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
  TabbedPanelPage,
  BasemapContainer,
  VectorLayer,
  DrawContainer
} from '@bayer/ol-kit'
import { fromLonLat } from 'ol/proj'
import olFeature from 'ol/Feature'
import olGeomPoint from 'ol/geom/Point'
import olSourceVector from 'ol/source/Vector'

import { ScaleInteraction } from '../../../src/Draw/ScaleInteraction'

import Welcome from '../../Welcome'

class App extends React.Component {
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

    this.dataLayer = await loadDataLayer(map, 'https://data.nasa.gov/api/geospatial/7zbq-j77a?method=export&format=KML')

    this.dataLayer.getSource().getFeatures().forEach(f => f.set('title', f.get('name')))

    window.map = map

    this.setupScaleInteraction()
  }

  setupScaleInteraction = () => {
    const feature = this.dataLayer.getSource().getFeatures().find(feature => feature.get('name') === 'United States of America')

    console.log(feature)

    const scaleInteraction = new ScaleInteraction({ feature })

    window.map.addInteraction(scaleInteraction)
  }

  render () {
    return (
      <Map onMapInit={this.onMapInit} fullScreen>
        <Popup />
        <TabbedPanel>
          <TabbedPanelPage tabIcon='Home'>
            <Welcome />
          </TabbedPanelPage>
          <TabbedPanelPage label='Layers'>
            <LayerPanelLayersPage disableHover={true} />
          </TabbedPanelPage>
          <TabbedPanelPage label='Styles'>
            <LayerStyler />
          </TabbedPanelPage>
          <TabbedPanelPage label='Draw'>
            <DrawContainer style={{ position: 'relative', width: 'auto' }} />
          </TabbedPanelPage>
        </TabbedPanel>
        <ContextMenu />
        <Controls />
        <BasemapContainer />
      </Map>
    )
  }
}

export default App
