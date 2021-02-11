import React from 'react'
import {
  Map,
  Popup,
  TabbedPanel,
  Controls,
  ContextMenu,
  LayerStyler, // HeatmapControls lives in here
  LayerPanelLayersPage,
  TabbedPanelPage,
  BasemapContainer,
} from '@bayer/ol-kit'
import HeatmapLayer from 'ol/layer/Heatmap'
import olFeature from 'ol/Feature'
import olGeomPoint from 'ol/geom/Point'
import olSourceVector from 'ol/source/Vector'

import DATA from './sample_points.json'

class App extends React.Component {
  onMapInit = async (map) => {
    const features = DATA.features.map(feature => {
      const formattedFeature = new olFeature({
        ...feature.properties,
        geometry: new olGeomPoint(feature.geometry.coordinates),
      })

      return formattedFeature
    })

    // set defaults that will be read by HeatmapControls component
    const blur = 30
    const radius = 2 

    // create a heatmap layer and add to the map
    const layer = new HeatmapLayer({
      title: 'Sample Points Heatmap',
      source: new olSourceVector({
        features
      }),
      blur: parseInt(blur, 10),
      radius: parseInt(radius, 10)
    })

    map.addLayer(layer)
    this.map = map
  }

  render () {
    return (
      <Map onMapInit={this.onMapInit} fullScreen>
        <Popup />
        <TabbedPanel>
          <TabbedPanelPage label='Styles'>
            <LayerStyler />
          </TabbedPanelPage>
          <TabbedPanelPage label='Layers'>
            <LayerPanelLayersPage />
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
