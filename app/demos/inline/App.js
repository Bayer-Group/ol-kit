import React from 'react'
import PaletteIcon from '@material-ui/icons/Palette'

import {
  Controls,
  MapPanel,
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
  const onMapInit = async (map) => {
    window.map = map

    const layer = new VectorTileLayer({
      source: new VectorTileSource({
        format: new MVT(),
        url: `http://localhost:7800/public.gis_osm_waterways_07_1/{z}/{x}/{y}.pbf`,
        // url: `https://free-{1-3}.tilehosting.com/data/v3/{z}/{x}/{y}.pbf.pict`,
        maxZoom: 14
      })
    });
    map.addLayer(layer)

    //layer.getSource().getFeatures().forEach(f => f.set('title', f.get('name')))

    //setting to false by default, to view the layer the user must go to the layer panel and make it visible
    layer.set('visible', false)
  }

  return (
    <div>
      <h1>Your site</h1>
      <p>ol-kit makes it easy to embed interactive maps into a page.</p>
      <div style={{width: '600px', height: '400px'}}>
        <Map onMapInit={onMapInit}>
          <Popup />
          <MapPanel>
            <LayerPanelPage label='Home'>
              <Welcome />
            </LayerPanelPage>
            <LayerPanelPage label='Styles'>
              <LayerPanelContent style={{ padding: '0px', fontFamily: 'Roboto, Arial, sans-serif' }}>
                <LayerPanelLayersPage />
              </LayerPanelContent>
            </LayerPanelPage>
          </MapPanel>
          <Controls variation={'dark'} />
        </Map>
      </div>
    </div>
  )
}

export default App
