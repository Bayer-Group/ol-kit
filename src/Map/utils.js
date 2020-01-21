import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'

/**
 * Create an openlayers map
 * @function
 * @category Map
 * @since 1.0.0
 * @param {Object} [opts] - Object of optional params
 * @param {String} [opts.target] - htm id tag that map will into which the map will render
 * @returns {ol.Map} A newly constructed [ol.Map]{@link https://openlayers.org/en/v4.6.5/apidoc/ol.Map.html}
 */
export function createMap ({ target }) {
  // create a new map instance
  const map = new Map({
    view: new View({
      center: [0, 0],
      zoom: 5
    }),
    layers: [
      new TileLayer({
        source: new OSM()
      })
    ],
    target
  })

  return map
}


/**
 * An HOC designed to automatically pass down an ol.Map from the top-level Map component
 * @function
 * @category Map
 * @since 1.0.0
 * @param {Component} component - A React component you want wrapped
 * @returns {Component} A wrapped React component which will automatically be passed 
 */
export function MapConsumer (Component) {
  return props => {
    return (
      !MapContext
        ? <Component {...props} />
        : (
          <MapContext.Consumer>
            {({ map }) => <Component map={map} {...props} />}
          </MapContext.Consumer>
        )
    )
  }
}