import React from 'react'
import Map from './Map'
import { Provider, ProviderContext } from 'Provider'

// if a Provider is not mounted, wrap <Map> with a <Provider> to allow non-breaking migration
function _Map (props) {
  return (
    !ProviderContext
      ? (
        <Provider>
          <Map {...props} />
        </Provider>
      )
      : <Map {...props} />
  )
}

export default _Map
