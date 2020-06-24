import React from 'react'
import Map from 'Map'
import LayerPanel from 'LayerPanel'
import Controls from 'Controls'
import Popup from 'Popup'
import BasemapContainer from 'BasemapContainer'
import LayerStyler from 'LayerStyler'
import LayerPanelPage from 'LayerPanelPage'
import LayerPanelContent from 'LayerPanelContent'
import VectorLayer from 'VectorLayer'
import GooglePlacesSearch from 'GooglePlacesSearch'
import { loadDataLayer } from 'DataLayers'
import PaletteIcon from '@material-ui/icons/Palette'
import olSourceVector from 'ol/source/vector'
import olFeature from 'ol/feature'
import olGeomPoint from 'ol/geom/point'
import olProj from 'ol/proj'

class App extends React.Component {
  onMapInit = async (map) => {
    const layer = new VectorLayer({
      title: 'Diltz\' House',
      source: new olSourceVector({
        features: [new olFeature({
          feature_type: ['the lake house'],
          title: 'the lake house',
          name: 'the lake house',
          geometry: new olGeomPoint(olProj.fromLonLat([-89.940598,38.923107])) })]
      })
    })

    map.addLayer(layer)
    // centerAndZoom(map, { x: -89.941642, y: 38.922929, zoom: 17.20 })

    const dataLayer = await loadDataLayer(map, 'https://data.nasa.gov/api/geospatial/7zbq-j77a?method=export&format=KML')

    dataLayer.getSource().getFeatures().forEach(f => f.set('title', f.get('name')))
  }

  render () {
    return (
      <Map onMapInit={this.onMapInit} fullScreen>
        <GooglePlacesSearch apiKey='AIzaSyDMoOv97jMcJwwAQGe5KBiHDSMxXNwKJPM' />
        <Popup />
        <LayerPanel>
          <LayerPanelPage tabIcon={<PaletteIcon />}>
            <LayerPanelContent style={{ padding: '0px', fontFamily: 'Roboto, Arial, sans-serif' }}>
              <LayerStyler />
            </LayerPanelContent>
          </LayerPanelPage>
        </LayerPanel>
        <Controls variation={'dark'} />
        <BasemapContainer />
      </Map>
    )
  }
}

export default App
