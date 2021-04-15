import Map from 'ol/Map'
import olLayerVector from 'ol/layer/Vector'
import olSourceVector from 'ol/source/Vector'
import olLayerTile from 'ol/layer/Tile'
import olSourceBingMaps from 'ol/source/BingMaps'
import olSourceOSM from 'ol/source/OSM'
import olSourceStamen from 'ol/source/Stamen'
import ugh from 'ugh'

/**
 * A utility that takes a string identifier and updates the basemap
 * @function
 * @category Basemap
 * @since 1.9.0
 * @param {Map} - a reference to openlayers map
 * @param {basemapIdentifier} - string identifier to update the basemap
 */
export function loadBasemapLayer (map, basemapIdentifier) {
  if (!(map instanceof Map)) return ugh.throw('\'loadBasemapLayer\' requires a valid openlayers map as the first argument')

  const layerTypeID = '_ol_kit_basemap'

  let basemap

  if (basemapIdentifier === 'blankWhite') {
    basemap = new olLayerVector({
      className: '_ol_kit_basemap_layer',
      [layerTypeID]: basemapIdentifier,
      source: new olSourceVector()
    })
  } else if (basemapIdentifier === 'osm') {
    const source = new olSourceOSM({
      layer: 'osm',
      cacheSize: 4096,
      reprojectionErrorThreshold: 0,
      crossOrigin: 'Anonymous'
    })

    basemap = new olLayerTile({
      className: '_ol_kit_basemap_layer',
      preload: Infinity,
      extent: undefined,
      [layerTypeID]: 'osm',
      source
    })
  } else if (basemapIdentifier === 'stamenTerrain') {
    const source = new olSourceStamen({
      layer: 'terrain',
      url: 'https://stamen-tiles-{a-d}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png',
      maxZoom: 18,
      cacheSize: 4096
    })

    basemap = new olLayerTile({
      className: '_ol_kit_basemap_layer',
      preload: Infinity,
      extent: undefined,
      [layerTypeID]: 'stamenTerrain',
      source
    })
  } else if (basemapIdentifier === 'stamenTonerDark') {
    const source = new olSourceStamen({
      layer: 'toner',
      url: 'https://stamen-tiles-{a-d}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png',
      maxZoom: 18,
      cacheSize: 40
    })

    basemap = new olLayerTile({
      className: '_ol_kit_basemap_layer',
      preload: Infinity,
      extent: undefined,
      [layerTypeID]: 'stamenTonerDark', // make sure we can identify this layer as a layer that has been created from the ol-kit basemap component.
      source
    })
  } else if (basemapIdentifier === 'stamenTonerLite') {
    const source = new olSourceStamen({
      layer: 'toner-lite',
      url: 'https://stamen-tiles-{a-d}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png',
      maxZoom: 18,
      cacheSize: 4096
    })

    basemap = new olLayerTile({
      className: '_ol_kit_basemap_layer',
      preload: Infinity,
      extent: undefined,
      [layerTypeID]: 'stamenTonerLite', // make sure we can identify this layer as a layer that has been created from the ol-kit basemap component.
      source
    })
  } else if (basemapIdentifier === 'bingAerial') {
    const DEFAULT_OPTS = {
      thumbnail: '',
      culture: 'en-us',
      imagerySet: 'Aerial',
      hidpi: false,
      cacheSize: 4096,
      maxZoom: 19,
      reprojectionErrorThreshold: 0,
      wrapX: true
    }
    const source = new olSourceBingMaps(DEFAULT_OPTS)

    basemap = new olLayerTile({
      className: '_ol_kit_basemap_layer',
      [layerTypeID]: 'bingAerial',
      source
    })
  } else {
    ugh.throw(`${basemapIdentifier} is not a valid basemap type!`)
  }

  const layers = map.getLayers()
  const hasBasemap = layers?.getArray()?.length ? layers.getArray()[0].get(layerTypeID) : false

  if (hasBasemap) {
    layers.setAt(0, basemap)
  } else {
    layers.insertAt(0, basemap)
  }
  layers.changed() // ol.Collection insertAt and setAt do not trigger a change event so we fire one manually so that we can rerender to display the active and inactive BasemapOptions
}
