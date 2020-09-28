import React from 'react'
import {
  Map,
  Popup,
  LayerPanel,
  Controls,
  ContextMenu,
  loadDataLayer,
  LayerStyler,
  LayerPanelPage,
  LayerPanelContent,
  BasemapContainer,
  VectorLayer,
  DrawContainer,
  LayerPanelHeader,
  LayerPanelLayersPage
} from '@bayer/ol-kit'
import PaletteIcon from '@material-ui/icons/Palette'
import CreateIcon from '@material-ui/icons/Create'
import { fromLonLat } from 'ol/proj'
import olFeature from 'ol/Feature'
import olGeomPoint from 'ol/geom/Point'
import olSourceVector from 'ol/source/Vector'
import GeoserverLayer from '../../../src/classes/GeoserverLayer'

class App extends React.Component {
  onMapInit = async (map) => {
    // create a vector layer and add to the map
    const layer = new VectorLayer({
      title: 'Diltz\' House',
      source: new olSourceVector({
        features: [new olFeature({
          feature_type: ['the lake house'],
          title: 'the lake house',
          name: 'the lake house',
          geometry: new olGeomPoint(fromLonLat([-89.940598, 38.923107]))
        })]
      })
    })

    map.addLayer(layer)

    // http://localhost:8600/geoserver/topp/states/ows?SERVICE=WMS
    GeoserverLayer.fromURI('http://localhost:8600/geoserver/topp/states/ows').then(layer => {
      map.addLayer(layer)
    })

    //const dataLayer = await loadDataLayer(map, 'https://data.nasa.gov/api/geospatial/7zbq-j77a?method=export&format=KML')

    //dataLayer.getSource().getFeatures().forEach(f => f.set('title', f.get('name')))

    window.map = map
  }

  render () {
    return (
      <Map onMapInit={this.onMapInit} fullScreen>
        <Popup />
        <LayerPanel>
          <LayerPanelLayersPage />
          <LayerPanelPage tabIcon={<PaletteIcon />}>
            <LayerPanelContent style={{ padding: '0px', fontFamily: 'Roboto, Arial, sans-serif' }}>
              <LayerStyler />
            </LayerPanelContent>
          </LayerPanelPage>
          <LayerPanelPage tabIcon={<CreateIcon />}>
            <LayerPanelContent style={{ padding: '0px', fontFamily: 'Roboto, Arial, sans-serif' }}>
              <LayerPanelHeader title='Draw' />
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
