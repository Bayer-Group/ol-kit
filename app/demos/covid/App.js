import React from 'react'
import { Controls, Map, Popup } from '@bayer/ol-kit'
import DataLoader from './DataLoader'

function App() {
  const onMapInit = map => {
    console.log('we got a map!', map)
    window.map = map
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
