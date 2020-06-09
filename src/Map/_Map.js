import React from 'react'
import PropTypes from 'prop-types'

import { Map } from 'Map'
import { Provider, isProviderMounted } from 'Provider'

class _Map extends React.Component {
  // if a Provider is not mounted, wrap <Map> with a <Provider> to allow non-breaking migration
  render () {
    console.log('_Map render', this.props, isProviderMounted)

    return isProviderMounted
      ? <Map {...this.props} />
      : (
        <Provider>
          <Map {...this.props}>
            {this.props.children}
          </Map>
        </Provider>
      )
  }
}

_Map.propTypes = {
  /** any ol-kit children components will automatically be passed a reference to the map object via the `map` prop */
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
}

export default _Map
