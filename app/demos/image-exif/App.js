import React from 'react'
import { Controls, Map, Popup, TabbedPanel, TabbedPanelPage } from '@bayer/ol-kit'
import ImageExif from '../../../src/ImageExif/ImageExif'
import { LayerPanel, PopupActionItem } from '../../../src'

const imageActions = () => {
  return [
    <PopupActionItem
      key={'exploreImageAction'}
      title={'Explore Image'}
      onClick={(e, feature) => console.log(feature)}
    />,
    <PopupActionItem
      key={'addImageDetailsAction'}
      title={'Add Details'}
      onClick={(e, feature) => console.log(feature)}
    />
  ]
}

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
      <Popup actions={imageActions()} />
    </Map>
  )
}

export default App
