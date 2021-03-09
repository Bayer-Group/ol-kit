import React from 'react'
import { Controls, Map, Popup, TabbedPanel, TabbedPanelPage } from '@bayer/ol-kit'
import ImageExif from '../../../src/ImageExif/ImageExif'
import { LayerPanel } from '../../../src'

function App () {
  return (
    <Map fullScreen>
      <TabbedPanel>
        <TabbedPanelPage label='Image EXIF'>
          <ImageExif />
        </TabbedPanelPage>
      </TabbedPanel>
      <LayerPanel />
      <Controls />
      <Popup />
    </Map>
  )
}

export default App
