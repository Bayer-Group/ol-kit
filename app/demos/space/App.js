import React from 'react'
import PaletteIcon from '@material-ui/icons/Palette'
import { ApolloProvider } from '@apollo/react-hooks'
import ApolloClient from 'apollo-boost'

import {
  BasemapContainer,
  Controls,
  TabbedPanel,
  LayerPanelContent,
  LayerPanelPage,
  LayerStyler,
  Map,
  Popup,
  TimeSlider,
  loadDataLayer
} from '@bayer/ol-kit'

import Welcome from '../../Welcome'
import ISS from './ISS'
import SpaceX from './SpaceX'

const client = new ApolloClient({
  uri: 'https://api.spacex.land/graphql/'
})

function App (props) {
  const onMapInit = async (map) => {
    window.map = map
    
    // Here we are fetching a KML layer and adding this layer to the map. This data maps out NASA's geopolitical boundries (countries)
    const dataLayer = await loadDataLayer(map, 'https://data.nasa.gov/api/geospatial/7zbq-j77a?method=export&format=KML')
    
    dataLayer.getSource().getFeatures().forEach(f => f.set('title', f.get('name')))
    dataLayer.set('title', 'NASA Geopolitcal Boundaries')
    //setting to false by default, to view the layer the user must go to the layer panel and make it visible
    dataLayer.set('visible', false)
  }

  return (
    <ApolloProvider client={client}>
      <Map onMapInit={onMapInit} fullScreen>
        <Popup />
        <TimeSlider />
        <SpaceX />
        <ISS />
        <TabbedPanel>
          <LayerPanelPage label='Home'>
            <Welcome />
          </LayerPanelPage>
          <LayerPanelPage label='Styles'>
            <LayerPanelContent style={{ padding: '0px', fontFamily: 'Roboto, Arial, sans-serif' }}>
              <LayerStyler />
            </LayerPanelContent>
          </LayerPanelPage>
        </TabbedPanel>
        <Controls variation={'dark'} />
        <BasemapContainer />
      </Map>
    </ApolloProvider>
  )
}

export default App
