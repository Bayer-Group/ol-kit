import Map from 'ol/Map'
import LayerVector from 'ol/layer/Vector'
import GeoJSON from 'ol/format/GeoJSON'
import olVectorSource from 'ol/source/Vector'
import olStyle from 'ol/style/Style'
import olCircleStyle from 'ol/style/Circle'
import olFill from 'ol/style/Fill'
import olStroke from 'ol/style/Stroke'

import { loadDataLayer } from 'DataLayers'
import { VectorLayer } from 'classes'
import ugh from 'ugh'
import { version } from '../../package.json'

/**
 * A utility that takes map state and outputs it as a project file
 * @function
 * @category Project
 * @since 1.9.0
 * @param {Map} - a reference to openlayers map
 * @returns {File} - a JSON file in ol-kit project format
 */
export async function createProject (map) {
  if (!(map instanceof Map)) return ugh.throw('\'createProject\' requires a valid openlayers map as the first argument')

  const rawLayers = map.getLayers().getArray()
  const layers = rawLayers.map(layer => {
    // some key/values are too large to store in the project file metadata
    const keysBlacklist = ['source']
    const keys = layer.getKeys().filter(key => !keysBlacklist.includes(key))
    const values = {}

    keys.forEach(key => {
      values[key] = layer.get(key)
    })
    const isVectorLayer = layer instanceof LayerVector || layer.isVectorLayer

    if (isVectorLayer && !layer.get('_ol_kit_data_source')) {
      // this is a vector layer that was created within ol-kit; get the feature geometries
      const features = layer.getSource().getFeatures()

      features.forEach(feature => feature.set('_ol_kit_parent', null))
      const geoJson = new GeoJSON().writeFeatures(features)

      values._ol_kit_project_geojson = geoJson
    }

    return values
  })
  const outputFile = {
    version,
    layers
  }

  return outputFile
}

/**
 * A utility that accepts an ol-kit project file and updates the map state
 * @function
 * @category Project
 * @since 1.9.0
 * @param {Map} - a reference to openlayers map
 * @param {File} - a JSON file in ol-kit project format
 */
export async function loadProject (map, project) {
  if (!(map instanceof Map)) return ugh.throw('\'loadProject\' requires a valid openlayers map as the first argument')

  const layers = project.layers.map(layerData => {
    const opts = {
      title: layerData.title
    }

    console.log(layerData)
    if (layerData?._ol_kit_project_geojson) {
      // create layer based off geometries
      const geoJson = new GeoJSON()
      const features = geoJson.readFeatures(layerData._ol_kit_project_geojson)
      const geoJsonFile = geoJson.writeFeaturesObject(features)
      console.log(geoJsonFile)

      loadDataLayer(map, geoJsonFile, opts)
    } else if (layerData?._ol_kit_data_source) {
      // fetch the external
      loadDataLayer(map, layerData._ol_kit_data_source, opts)
    } else if (layerData?._ol_kit_basemap) {
      // set the basemap
      const basemapLayer = map.getLayers().getArray().find(l => !!l.get('_ol_kit_basemap'))

      console.log('basemap layer', basemapLayer)
    } else {
      console.log('ruh roh!')
    }
  })
}
