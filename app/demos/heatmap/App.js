import React from 'react'
import {
  Map,
  Popup,
  TabbedPanel,
  Controls,
  ContextMenu,
  HeatmapControls,
  HeatmapLayer,
  loadDataLayer,
  LayerStyler,
  LayerPanelLayersPage,
  TabbedPanelPage,
  BasemapContainer,
  VectorLayer,
  DrawContainer
} from '@bayer/ol-kit'

import KML from 'ol/format/KML'
import VectorSource from 'ol/source/Vector'
import { fromLonLat } from 'ol/proj'
import olFeature from 'ol/Feature'
import olGeomPoint from 'ol/geom/Point'
import olSourceVector from 'ol/source/Vector'
import {Fill, Stroke, Circle, Style} from 'ol/style'

import TRAIL_DATA from './trekko_trails.json'

import Welcome from '../../Welcome'

class App extends React.Component {
  onMapInit = async (map) => {
    const trails = TRAIL_DATA.data.getTrails
    const features = trails.filter(trail => trail.condition.color !== 'UNKNOWN').map(trail => {
      const colors = {
        'GREEN': '#03d88a',
        'RED': '#fd5c3e',
        'YELLOW': '#dca138',
        'UNKNOWN': '#707070'
      }
      const fill = new Fill({
        color: colors[trail.condition.color]
      });
      const stroke = new Stroke({
        color: colors[trail.condition.color],
        width: 1.25
      })
      const style = new Style({
        image: new Circle({
          fill,
          stroke,
          radius: 8
        }),
        fill,
        stroke
      })
      const feature = new olFeature({
        ...trail,
        ...trail.condition,
        geometry: new olGeomPoint(fromLonLat([trail.longitude, trail.latitude])),
      })
      feature.setStyle(style)
      return feature
    })

    console.log(trails)

    const pointLayer = new VectorLayer({
      title: 'Trekko Trails',
      source: new olSourceVector({
        features
      })
    })

    // map.addLayer(pointLayer)

    const blur = 80
    const radius = 10

    // create a vector layer and add to the map
    const layer = new HeatmapLayer({
      title: 'Heatmap',
      source: new olSourceVector({
        features
      }),
      blur: parseInt(blur, 10),
      radius: parseInt(radius, 10),
      // weight: feature => {
      //   // 2012_Earthquakes_Mag5.kml stores the magnitude of each earthquake in a
      //   // standards-violating <magnitude> tag in each Placemark.  We extract it from
      //   // the Placemark's name instead.
      //   const name = feature.get('name')
      //   const magnitude = parseFloat(name.substr(2))
      //   return magnitude - 5
      // },
    })

    map.addLayer(layer)
    console.log(map.getLayers().getArray())
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
            <LayerPanelLayersPage />
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
