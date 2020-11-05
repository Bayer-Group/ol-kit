import React, { Component } from 'react'
import { loadCountyBoundary, loadStateBoundary, loadPoint, loadSatelliteLayer, loadHillShade } from './components/loaders'
import {
  Map,
  Popup,
  Controls,
  loadDataLayer,
  TabbedPanel,
  LayerPanelPage,
  LayerPanelLayersPage,
  TimeSlider,
  BasemapContainer
} from '@bayer/ol-kit'
import Chart from './Chart'

import Welcome from '../../Welcome'

class MapView extends Component {
    state= {
        selectedFeature:null
    }

  mapClickHandler = e => {
    const { pixel } = e;
    const featuresAtPixel = this.state.map.getFeaturesAtPixel(pixel)
    console.log('featuresAtPixel',featuresAtPixel)
    if(featuresAtPixel && featuresAtPixel.length){
        this.setState({selectedFeature: featuresAtPixel[0], isState: featuresAtPixel[0].values_.LSAD ? false : true})
    }
  }

  addLayerOnLoaded = async (ev) => {
    const map = this.state.map
    const fileName = ev.target.fileName
    const content = ev.target.result
    const layer = await loadDataLayer(map, content, { addToMap: false })
    layer.set('title', fileName)
    map.addLayer(layer)
  }

  addLayerFromFile = (file) => {
    const fileData = new FileReader()
    fileData.fileName = file.name
    fileData.onloadend = this.addLayerOnLoaded
    fileData.readAsText(file)
  }

  onMapInit = (map) => {
    this.setState({ map })
    loadCountyBoundary(map)
    loadStateBoundary(map)
    loadPoint(map)
    loadSatelliteLayer(map)
    loadHillShade(map)
    map.on('click', this.mapClickHandler)
  }

  render() {
    return (
      <Map onMapInit={this.onMapInit} fullScreen className="vw-100 vh-100">
        <Controls />
        <Popup />
        <TimeSlider />
        <TabbedPanel>
          <LayerPanelPage tabIcon='Home'>
            <Welcome />
          </LayerPanelPage>
          <LayerPanelPage label='Layers'>
            <LayerPanelLayersPage />
          </LayerPanelPage>
        </TabbedPanel>
        <BasemapContainer />
        {this.state.selectedFeature? <Chart feature={this.state.selectedFeature} isState={this.state.isState}/>:null}
      </Map>
    )
  }
}

export default MapView
