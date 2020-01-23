import React from 'react'
import PropTypes from 'prop-types'
import { MapContext } from '../Map/Map'

/**
 * An HOC designed to automatically pass down an ol.Map from the top-level Map component
 * @function
 * @category Map
 * @since 0.1.0
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

// MapConsumer.propTypes = {
//   /** child component will be passed a reference to the map object via the component's `map` prop */
//   children: PropTypes.node.isRequired
// }

//export default MapConsumer
