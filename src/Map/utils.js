import React from 'react'
import Map from 'ol/map'
import View from 'ol/view'
import TileLayer from 'ol/layer/tile'
import OSM from 'ol/source/osm'
import olProj from 'ol/proj'
import qs from 'qs'

import { MapContext } from './Map'

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
  if (!opts.target) throw new Error('You must pass an options object with a DOM target for the map')
  if (typeof opts.target !== 'string' && opts.target instanceof Element !== true) throw new Error('The target should either by a string id of an existing DOM element or the element itself')

  // create a new map instance
  const map = new Map({
    view: new View({
      center: [-10686671.119494, 4721671.569715], // centered over US in EPSG:3857
      zoom: 5
    }),
    layers: [
      new TileLayer({
        source: new OSM()
      })
    ],
    target: opts.target,
    controls: []
  })

  return map
}


/**
 * An HOC designed to automatically pass down an ol.Map from the top-level Map component
 * @function
 * @category Map
 * @since 0.1.0
 * @param {Component} component - A React component you want wrapped
 * @returns {Component} A wrapped React component which will automatically be passed a reference to the ol.Map
 */
export function connectToMap (Component) {
  return props => (
    !MapContext
      ? <Component {...props} />
      : (
        <MapContext.Consumer>
          {({ map }) => <Component map={map} {...props} />}
        </MapContext.Consumer>
      )
  )
}

export function updateUrlFromMap (map, viewParam = 'view') {
  const query = qs.parse(window.location.search, { ignoreQueryPrefix: true })
  const coords = olProj.transform(map.getView().getCenter(), map.getView().getProjection().getCode(), 'EPSG:4326')
  const view = { [viewParam]: `${parseFloat(coords[1]).toFixed(6)},${parseFloat(coords[0]).toFixed(6)},${parseFloat(map.getView().getZoom()).toFixed(2)},${parseFloat(map.getView().getRotation()).toFixed(2)}` }
  const newQuery = {...query, ...view}
  const queryString = qs.stringify(newQuery, { addQueryPrefix: true, encoder: (str) => str })
  const newUrl = window.location.pathname + queryString

  window.history.replaceState(null, '', newUrl)

  return newUrl
}
