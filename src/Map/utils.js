import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import { transform } from 'ol/proj'
import olInteractionSelect from 'ol/interaction/Select'
import olFill from 'ol/style/Fill'
import olCircle from 'ol/style/Circle'
import olStyle from 'ol/style/Style'
import olStroke from 'ol/style/Stroke'
import qs from 'qs'

import ugh from 'ugh'

const OLKIT_ZOOMBOX_ID = '_ol-kit-css-zoombox-style'

export function replaceZoomBoxCSS (dragStyle) {
  const exists = document.getElementById(OLKIT_ZOOMBOX_ID)
  const dragStyleString = Object.entries(dragStyle)
    .map(([k, v]) => `${k}:${v}`)
    .join(';')
    .replace(/[A-Z]/g, match => `-${match.toLowerCase()}`)

  if (!exists) {
    const style = window.document.createElement('style')

    style.id = OLKIT_ZOOMBOX_ID
    style.textContent = `.ol-box{ ${dragStyleString} }`

    window.document.head.append(style)
  }
}

/**
 * Create an openlayers map
 * @function
 * @category Map
 * @since 0.1.0
 * @param {Object} [opts] - Object of optional params
 * @param {String} [opts.target] - htm id tag that map will into which the map will render
 * @returns {ol.Map} A newly constructed [ol.Map]{@link https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html}
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
        className: '_ol_kit_basemap_layer',
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
  const coords = transform(map.getView().getCenter(), map.getView().getProjection().getCode(), 'EPSG:4326')
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
  const transformedCoords = transform([Number(opts.x), Number(opts.y)], 'EPSG:4326', map.getView().getProjection().getCode())

  map.getView().setCenter(transformedCoords)
  map.getView().setZoom(opts.zoom)

  return transformedCoords
}

/**
 * Convert an XY pair to lat/long
 * @function
 * @category Map
 * @since 0.16.0
 * @param {ol.Map} map - reference to the openlayer map object
 * @param {Number} x - the x coordinate
 * @param {Number} y - the x coordinate
 * @returns {Object} An object containing a `longitude` and `latitude` property
 */
export function convertXYtoLatLong (map, x, y) {
  const coords = map.getCoordinateFromPixel([x, y])
  const transformed = transform(coords, map.getView().getProjection().getCode(), 'EPSG:4326')
  const longitude = Number((Number(transformed[0] || 0) % 180).toFixed(6))
  const latitude = Number((transformed[1] || 0).toFixed(6))

  return {
    longitude,
    latitude
  }
}

/**
 * Create a new openlayers select interaction with default styling
 * @function
 * @category Map
 * @since 0.2.0
 * @returns {ol.interaction.Select} https://openlayers.org/en/latest/apidoc/module-ol_interaction_Select-Select.html
 */
export function createSelectInteraction (props) {
  const DEFAULT_SELECT_STYLE = new olStyle({
    stroke: new olStroke({
      color: 'cyan',
      width: 3
    }),
    image: new olCircle({
      radius: 5,
      fill: new olFill({
        color: '#ffffff'
      }),
      stroke: new olStroke({
        color: 'cyan',
        width: 2
      })
    })
  })


  return new olInteractionSelect({
    hitTolerance: 3,
    style: [DEFAULT_SELECT_STYLE],
    ...props
  })
}
