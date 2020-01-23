import React from 'react'
import Map from 'ol/map'
import View from 'ol/view'
import TileLayer from 'ol/layer/tile'
import OSM from 'ol/source/osm'

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
export function createMap ({ target }) {
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
    target,
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
