import React from 'react'
import { Controls, Map, Popup } from '@bayer/ol-kit'
import olLayerTile from 'ol/layer/Tile'
import olSourceStamen from 'ol/source/Stamen'
import DataLoader from './DataLoader'

function App() {
  const onMapInit = map => {
    // create a Stamen basemap source
    const source = new olSourceStamen({
      layer: 'toner',
      url: 'https://stamen-tiles-{a-d}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png',
      maxZoom: 18,
      cacheSize: 40
    })
    // tile layer takes the Stamen source
    const layer = new olLayerTile({
      className: '_ol_kit_basemap_layer',
      preload: Infinity,
      extent: undefined,
      _ol_kit_basemap: 'stamenTonerDark', // make sure we can identify this layer as an ol-kit basemap
      source
    })
    // pull the layers off the map
    const layers = map.getLayers()

    // reset the 0th index layer (old basemap) to new basemap
    layers.setAt(0, layer)
  }

  return (
    <Map onMapInit={onMapInit} fullScreen>
      <DataLoader />
      <Controls />
      <Popup />
    </Map>
  )
}

export default App
