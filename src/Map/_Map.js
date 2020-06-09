import React from 'react'
import Map from './Map'
import { Provider, _isProviderMounted } from 'Provider'

// if a Provider is not mounted, wrap <Map> with a <Provider> to allow non-breaking migration
function _Map (props) {
  return (
    _isProviderMounted
      ? <Map {...props} />
      : (
        <Provider>
          <Map {...props} />
        </Provider>
      )
  )
}

export default _Map
