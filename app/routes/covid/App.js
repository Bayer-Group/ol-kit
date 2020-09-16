import React from 'react'
import { Controls, Map, Popup } from '@bayer/ol-kit'
import olFeature from 'ol/feature'
import olVectorLayer from 'ol/layer/vector'
import olPoint from 'ol/geom/point'
import olVectorSource from 'ol/source/vector'

import DataLoader from './DataLoader'

function App() {
  const onMapInit = map => {
    console.log('we got a map!', map)
    window.map = map

    // const features = []
    // features.push(new olFeature(new olPoint([-10686671.119494, 4721671.569715])))
    // features.push(new olFeature(new olPoint([-10646670.119494, 4721671.569715])))
    //
    // const source = new olVectorSource({ features })
    // const vectorLayer = new olVectorLayer({ source })
    //
    // map.addLayer(vectorLayer)
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
