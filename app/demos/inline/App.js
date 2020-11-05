import React from 'react'
import PaletteIcon from '@material-ui/icons/Palette'

import {
  Controls,
  TabbedPanel,
  LayerPanelContent,
  LayerPanelPage,
  LayerPanelLayersPage,
  Map,
  Popup
} from '@bayer/ol-kit'

import MVT from 'ol/format/MVT'
import VectorTileSource from 'ol/source/VectorTile'
import VectorTileLayer from 'ol/layer/VectorTile'

import Welcome from '../../Welcome'

function App (props) {
  return (
    <div>
      <h1>Your site</h1>
      <p>ol-kit makes it easy to embed interactive maps into a page.</p>
      <div style={{width: '600px', height: '400px'}}>
        <Map>
          <Popup />
          <TabbedPanel>
            <LayerPanelPage label='Home'>
              <Welcome />
            </LayerPanelPage>
            <LayerPanelPage label='Layers'>
              <LayerPanelLayersPage />
            </LayerPanelPage>
          </TabbedPanel>
          <Controls variation={'dark'} />
        </Map>
      </div>
    </div>
  )
}

export default App
