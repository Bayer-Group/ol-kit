import Map from 'ol/map'
import View from 'ol/view'
import TileLayer from 'ol/layer/tile'
import OSM from 'ol/source/osm'
import olProj from 'ol/proj'
import olInteractionSelect from 'ol/interaction/select'
import olFill from 'ol/style/fill'
import olCircle from 'ol/style/circle'
import olStyle from 'ol/style/style'
import olStroke from 'ol/style/stroke'
import qs from 'qs'

import ugh from 'ugh'
import { connectToContext } from 'Provider'

/**
 * Create an openlayers map
 * @function
 * @category Map
 * @since 0.1.0
 * @param {Object} [opts] - Object of optional params
 * @param {String} [opts.target] - htm id tag that map will into which the map will render
 * @returns {ol.Map} A newly constructed [ol.Map]{@link https://openlayers.org/en/v4.6.5/apidoc/ol.Map.html}
 */
export function createMap (opts = {}) {
  if (!opts.target) return ugh.throw('You must pass an options object with a DOM target for the map')
  if (typeof opts.target !== 'string' && opts.target instanceof Element !== true) return ugh.throw('The target should either by a string id of an existing DOM element or the element itself')

  // create a new map instance
  const map = new Map({
    view: new View({
      center: [-10686671.119494, 4721671.569715], // centered over US in EPSG:3857
      zoom: 5
    }),
    layers: [
      new TileLayer({
        _ol_kit_basemap: 'osm', // used by BasemapManager
        source: new OSM()
      })
    ],
    target: opts.target,
    controls: []
  })

  return map
}

/**
 * A wrapper utility function designed to automatically pass down an ol.Map from the top-level Map component
 * @function
 * @category Map
 * @since 0.1.0
 * @param {Component} component - A React component you want wrapped
 * @returns {Component} A wrapped React component which will automatically be passed a reference to the ol.Map
 */
export const connectToMap = connectToContext

/**
 * Update the url with map location coordinates, zoom level & rotation
 * @function
 * @category Map
 * @since 0.1.0
 * @param {ol.Map} map - reference to the openlayer map object
 * @param {String} viewParam - the query param that will be used to update the url with view info
 * @returns {String} The url that is set within the function
 */
export function updateUrlFromMap (map, viewParam = 'view') {
  if (!(map instanceof Map)) return ugh.throw('\'updateUrlFromMap\' requires a valid openlayers map as the first argument')
  const query = qs.parse(window.location.search, { ignoreQueryPrefix: true })
  const coords = olProj.transform(map.getView().getCenter(), map.getView().getProjection().getCode(), 'EPSG:4326')
  const view = { [viewParam]: `${parseFloat(coords[1]).toFixed(6)},${parseFloat(coords[0]).toFixed(6)},${parseFloat(map.getView().getZoom()).toFixed(2)},${parseFloat(map.getView().getRotation()).toFixed(2)}` }
  const newQuery = { ...query, ...view }
  const queryString = qs.stringify(newQuery, { addQueryPrefix: true, encoder: (str) => str })
  const newUrl = window.location.pathname + queryString

  window.history.replaceState(null, '', newUrl)

  return newUrl
}

/**
 * Update the map view with location coordinates, zoom level & rotation from the url
 * @function
 * @category Map
 * @since 0.1.0
 * @param {ol.Map} map - reference to the openlayer map object
 * @param {String} viewParam - the query param that will be read to update the map position
 * @returns {Promise} Resolved with transformed center coords after the map has been updated by url info
 */
export function updateMapFromUrl (map, viewParam = 'view') {
  const promise = new Promise((resolve, reject) => {
    const query = qs.parse(window.location.search, { ignoreQueryPrefix: true })

    if (!(map instanceof Map)) return ugh.throw('\'updateMapFromUrl\' requires a valid openlayers map as the first argument', reject)
    if (!query[viewParam]) return ugh.warn(`url param "${viewParam}" was not found on page load`, resolve)
    const [y, x, zoom, rotation] = query[viewParam].split(',')
    const centerAndZoomOpts = { x, y, zoom }
    const coords = centerAndZoom(map, centerAndZoomOpts)

    // wait for the map to update then resolve promise
    map.once('postrender', () => resolve(coords))
    map.getView().animate({
      rotation,
      duration: 0
    })
  })

  return promise
}

/**
 * Update the map location to provided zoom & x, y coordinates
 * @function
 * @category Map
 * @since 0.1.0
 * @param {ol.Map} map - reference to the openlayer map object
 * @param {Object} opts - include x, y, & zoom options
 * @returns {Array} Coordinates used to update the map
 */
export function centerAndZoom (map, opts = {}) {
  if (!(map instanceof Map)) return ugh.throw('\'centerAndZoom\' requires a valid openlayers map as the first argument')
  const transformedCoords = olProj.transform([Number(opts.x), Number(opts.y)], 'EPSG:4326', map.getView().getProjection().getCode())

  map.getView().setCenter(transformedCoords)
  map.getView().setZoom(opts.zoom)

  return transformedCoords
}

/**
 * Create a new openlayers select interaction with default styling
 * @function
 * @category Map
 * @since 0.2.0
 * @returns {ol.interaction.Select} https://openlayers.org/en/v4.6.5/apidoc/ol.interaction.Select.html
 */
export function createSelectInteraction () {
  const DEFAULT_SELECT_STYLE = new olStyle({
    stroke: new olStroke({
      color: 'cyan',
      width: 3
    }),
    image: new olCircle({
      radius: 5,
      fill: new olFill({
        color: 'white'
      }),
      stroke: new olStroke({
        color: 'cyan',
        width: 2
      })
    })
  })

  return new olInteractionSelect({
    hitTolerance: 3,
    style: [DEFAULT_SELECT_STYLE]
  })
}
