import React, { Component } from 'react'
import { loadCountyBoundary, loadStateBoundary, loadPoint, loadSatelliteLayer, loadHillShade } from './components/loaders'
import {
  Map,
  Popup,
  Controls,
  loadDataLayer,
  LayerPanel,
  TimeSlider,
 // VectorLayer,
 // VectorSource,
  BasemapContainer
} from '@bayer/ol-kit'
import Chart from './Chart'


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
    //loadWMSLayer(map)
    //loadLandCover(map)
    //loadWFS(map)
    map.on('click', this.mapClickHandler)

    //To load data directly from api, can use loadDataLayer function from ol-kit
    // const dataLayer = loadDataLayer(map, 'https://opendata.arcgis.com/datasets/628578697fb24d8ea4c32fa0c5ae1843_0.geojson')
    // const fireLayer = loadDataLayer(map, 'https://opendata.arcgis.com/datasets/c57777877aa041ecaef98ff2519aabf6_22.geojson')
    // fireLayer.then( lyr => {
    //   console.log('fireLayer', lyr)
    //   lyr.set('title', 'Fire 2003')
    // })
  }

  render() {
    console.log('rendering')
    return (
      <Map onMapInit={this.onMapInit} className="vw-100 vh-100">
        <Controls />
        <Popup />
        <TimeSlider />
        <LayerPanel />
        <BasemapContainer />
        {this.state.selectedFeature? <Chart feature={this.state.selectedFeature} isState={this.state.isState}/>:null}
      </Map>
    )
  }
}

export default MapView
