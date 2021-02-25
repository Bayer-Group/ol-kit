import React from 'react'
import {
  Map,
  Popup,
  LayerPanel,
  Controls,
  ContextMenu,
  LayerStyler,
  LayerPanelPage,
  LayerPanelContent,
  BasemapContainer,
  VectorTileLayer,
  DrawContainer
} from '@bayer/ol-kit'
import MVT from 'ol/format/MVT'
import VectorTileSource from 'ol/source/VectorTile'
import olFeature from 'ol/Feature'

class App extends React.Component {
  onMapInit = async (map) => {
    // create a vector layer and add to the map
    const layer = new VectorTileLayer({
      className: 'vector-tiles-layer',
      declutter: true,
      title: 'Vector Tiles Layer',
      source: new VectorTileSource({
        maxZoom: 15,
        format: new MVT({
          idProperty: 'iso_a3',
          featureClass: olFeature
        }),
        url: 'https://basemaps.arcgis.com/v1/arcgis/rest/services/World_Basemap/VectorTileServer/tile/{z}/{y}/{x}.pbf'
      }),
    })

    map.addLayer(layer)

    window.map = map
  }

  render () {
    return (
      <Map onMapInit={this.onMapInit} fullScreen>
        <Popup />
        <LayerPanel>
          <LayerPanelPage tabIcon='Layer Styler'>
            <LayerPanelContent style={{ padding: '0px', fontFamily: 'Roboto, Arial, sans-serif' }}>
              <LayerStyler />
            </LayerPanelContent>
          </LayerPanelPage>
          <LayerPanelPage label={'Draw'}>
            <LayerPanelContent style={{ padding: '0px', fontFamily: 'Roboto, Arial, sans-serif' }}>
              <DrawContainer style={{ position: 'relative', width: 'auto' }} />
            </LayerPanelContent>
          </LayerPanelPage>
        </LayerPanel>
        <ContextMenu />
        <Controls />
        <BasemapContainer />
      </Map>
    )
  }
}

export default App
