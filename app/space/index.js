import React from 'react'
import PaletteIcon from '@material-ui/icons/Palette'
import { ApolloProvider } from '@apollo/react-hooks'
import ApolloClient from 'apollo-boost'

import olSourceVector from 'ol/source/vector'
import olFeature from 'ol/feature'
import olGeomPoint from 'ol/geom/point'
import olProj from 'ol/proj'

import {
  BasemapContainer,
  Controls,
  LayerPanel,
  LayerPanelContent,
  LayerPanelPage,
  LayerStyler,
  Map,
  Popup,
  TimeSlider,
  // VectorLayer,
  loadDataLayer
} from '../src' // replace this with '@bayer/ol-kit' in the wild

import ISS from './ISS'
import SpaceX from './SpaceX'

const client = new ApolloClient({
  uri: 'https://api.spacex.land/graphql/'
})

function App (props) {
  const onMapInit = async (map) => {
    window.map = map
    // const layer = new VectorLayer({
    //   title: 'Diltz\' House',
    //   source: new olSourceVector({
    //     features: [new olFeature({
    //       feature_type: ['the lake house'],
    //       title: 'the lake house',
    //       name: 'the lake house',
    //       geometry: new olGeomPoint(olProj.fromLonLat([-89.940598, 38.923107]))
    //     })]
    //   })
    // })
    //
    // map.addLayer(layer)
    // // centerAndZoom(map, { x: -89.941642, y: 38.922929, zoom: 17.20 })
    
    const dataLayer = await loadDataLayer(map, 'https://data.nasa.gov/api/geospatial/7zbq-j77a?method=export&format=KML')
    
    dataLayer.getSource().getFeatures().forEach(f => f.set('title', f.get('name')))
    dataLayer.set('title', 'NASA Geopolitcal Boundaries')
    dataLayer.set('visible', false)
  }

  return (
    <ApolloProvider client={client}>
      <Map onMapInit={onMapInit} fullScreen>
        <Popup />
        <TimeSlider />
        <SpaceX />
        <ISS />
        <LayerPanel>
          <LayerPanelPage tabIcon={<PaletteIcon />}>
            <LayerPanelContent style={{ padding: '0px', fontFamily: 'Roboto, Arial, sans-serif' }}>
              <LayerStyler />
            </LayerPanelContent>
          </LayerPanelPage>
        </LayerPanel>
        <Controls variation={'dark'} />
        <BasemapContainer />
      </Map>
    </ApolloProvider>
  )
}

export default App
