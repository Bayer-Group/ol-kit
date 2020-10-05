import olVectorSource from 'ol/source/Vector'
import olStyle from 'ol/style/Style'
import olFill from 'ol/style/Fill'
import olCircle from 'ol/style/Circle'
import olStroke from 'ol/style/Stroke'
import KML from 'ol/format/KML'
import GeoJSON from 'ol/format/GeoJSON'
import  { VectorLayer, } from '@bayer/ol-kit'
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
import TileWMS from 'ol/source/TileWMS';
import * as OlLoadingStrategy from 'ol/loadingstrategy';
import OlVector from 'ol/source/Vector';
import OlLayerVector from 'ol/layer/Vector';
import OlFormatGeoJSON from 'ol/format/GeoJSON'; 


export function getFeaturesFromDataSet (map, dataSet) {
    const mapProjection = map.getView().getProjection().getCode()
    const opts = { featureProjection: mapProjection }

    try {
        const geoJson = new GeoJSON(opts)
        const features = geoJson.readFeatures(dataSet)

        return features
    } catch (e) { /* must not be JSON */ }
    try {
        const kml = new KML({ extractStyles: false })
        const features = kml.readFeatures(dataSet, opts)

        return features
    } catch (e) { /* must not be KML */ }
        // not a supported data format, return empty features array
        return []
}

export function loadStateBoundary ( map ) {
    const stateData = require('../data/gz_2010_us_states_20m.json')

    try {
        const features = getFeaturesFromDataSet(map, stateData)
        // create the layer and add features
        const source = new olVectorSource({ features: features })
        const vectorLayer = new VectorLayer({ source: source })

        vectorLayer.setStyle(
            new olStyle({
                fill: new olFill({ color: '#7FDBFF33' }),
                stroke: new olStroke({
                    color: '#0074D9', width: 2
                })
            })
        )

        // set attribute for LayerPanel title
        vectorLayer.set('title', 'State Boundary')
        map.addLayer(vectorLayer)
    } catch (e) {
        console.log('error parsing json file:', e)
    }
}

export function loadCountyBoundary ( map ) {
    const stateData = require('../data/gz_2010_us_county_20m.json')

    try {
        const features = getFeaturesFromDataSet(map, stateData)
        // create the layer and add features
        const source = new olVectorSource({ features: features })
        const vectorLayer = new VectorLayer({ source: source })

        vectorLayer.setStyle(
            new olStyle({
                fill: new olFill({ color: 'rgba(118, 93, 105, 1)' }),
                stroke: new olStroke({
                    color: 'black', width: 0.5
                })
            })
        )

        vectorLayer.set('title', 'County Boundary')
        map.addLayer(vectorLayer)
    } catch (e) {
        console.log('error parsing json file:', e)
    }
}

export function loadPoint ( map ) {
    const pointData = require('../data/covid_tweeter.json')

    try {
        const features = getFeaturesFromDataSet(map, pointData)
        // create the layer and add features
        const source = new olVectorSource({ features })
        const vectorLayer = new VectorLayer({ source, _ol_kit_time_key: 'created_at' })

        vectorLayer.setStyle(
            new olStyle({
                image: new olCircle({
                  radius: 5,
                  fill: new olFill({color: '#666666'}),
                  stroke: new olStroke({color: '#bada55', width: 1}),
                })
            })
        )

        vectorLayer.set('title', 'Covid Tweeter Points')
        map.addLayer(vectorLayer)
    } catch (e) {
        console.log('error parsing json file:', e)
    }
}

export function loadWeatherData( map ) {
    const dataFetcher = async() => {
        const dataUrl = 'https://tile.openweathermap.org/map/precipitation/{z}/{x}/{y}.png?appid={apikeyhere}'
        map.addLayer(new TileLayer({
            title: "Weather Data Layer",
            source: new XYZ({
                url: dataFetcher
            })
        }))
    }
}

export function loadSatelliteLayer( map ) {
    const key = 'DGofXegF9OaACdla9XgS'
    const attributions =
  '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
  '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';

    const rasterLayer = new TileLayer({
      source: new XYZ({
        attributions: attributions,
        url: 'https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=' + key,
        maxZoom: 20,
      }),
    });
    rasterLayer.set('title', 'Satellite Image Layer')
    rasterLayer.set('visible', false)
    map.addLayer(rasterLayer)
}

export function loadWMSLayer(map) {
    const wmsLayer = new TileLayer({
        extent: [-13884991, 2870341, -7455066, 6338219],
        source: new TileWMS({
          url: 'http://ec2-54-211-232-90.compute-1.amazonaws.com:8080/team12/wms',
          params: {'LAYERS': 'team12:county_us_2019', 'TILED': true},
          serverType: 'geoserver',
          // Countries have transparency, so do not fade tiles:
          transition: 0,
        })
      })
      wmsLayer.set('title', 'County Layer')
      map.addLayer(wmsLayer)
}

export function loadHillShade(map){
    const hillLayer =  new TileLayer({
        source: new XYZ({
            url: 'https://api.maptiler.com/tiles/hillshades/{z}/{x}/{y}.png?key=DGofXegF9OaACdla9XgS',
            tileSize: 256,
            crossOrigin: 'anonymous'
        })
    })
    hillLayer.set('title', 'Hillshade Layer')
    hillLayer.set('visible', false)
    map.addLayer(hillLayer)
}

export function loadLandCover(map){
    const landcoverLayer =  new TileLayer({
        source: new XYZ({
            url: 'https://api.maptiler.com/tiles/landcover/{z}/{x}/{y}.pbf?key=DGofXegF9OaACdla9XgS',
        })
    })
    console.log(landcoverLayer)
    landcoverLayer.set('visible', false)
    landcoverLayer.set('title', 'Land Cover Layer')
    map.addLayer(landcoverLayer)
}
 export function loadWFS(map){
     const vectorSource = new OlVector({
         format: new OlFormatGeoJSON(),
         url: function (extent) {
           return (
             'http://ec2-54-211-232-90.compute-1.amazonaws.com:8080/team12/wfs?service=WFS&' +
             'version=1.1.0&request=GetFeature&typename=team12:count_us_2019&' +
             'outputFormat=application/json&srsname=EPSG:4269&' +
             'bbox=' +
             extent.join(',') +
             ',EPSG:4269'
           );
         },
         strategy: OlLoadingStrategy.bbox,
       });

       const vector = new OlLayerVector({
         source: vectorSource,
         style: new olStyle({
           stroke: new olStroke({
             color: 'rgba(0, 0, 255, 1.0)',
             width: 2,
           }),
         }),
       });

     // set attribute for LayerPanel title
     vector.set('title', 'County Boundary')
     map.addLayer(vector)
 }


