import React, { useState } from 'react'
import { Controls, Map, Popup, TabbedPanel, TabbedPanelPage } from '@bayer/ol-kit'
import Viewer from 'react-viewer'
import ImageExif from '../../../src/ImageExif/ImageExif'
import { LayerPanel, PopupActionItem } from '../../../src'
import Welcome from '../../Welcome'

const imageActions = setActiveImage => {
  return [
    <PopupActionItem
      key={'exploreImageAction'}
      title={'Explore Image'}
      onClick={(e, feature) => setActiveImage(feature.values_.imageURL)}
    />
  ]
}

function App () {
  const [activeImage, setActiveImage] = useState(null)

  return (
    <Map fullScreen>
      <Viewer
        visible={!!activeImage}
        onClose={() => { setActiveImage(null) } }
        images={[{ src: activeImage, alt: 'Field Image' }]}
      />
      <TabbedPanel>
        <TabbedPanelPage label='Home'>
          <Welcome />
        </TabbedPanelPage>
        <TabbedPanelPage label='Image EXIF'>
          <ImageExif />
        </TabbedPanelPage>
      </TabbedPanel>
      <LayerPanel />
      <Controls />
      <Popup actions={imageActions(setActiveImage)} />
    </Map>
  )
}

export default App
