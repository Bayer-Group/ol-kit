import React from 'react'
import Map from './Map' // this should be the only relative ./Map import in ol-kit
import { Provider } from 'Provider'
import { MultiMapContext } from 'MultiMapManager'

// check for MultiMapManager so Provider wrapper does not also render a context
function _Map (props) {
  return (
    !MultiMapContext
      ? (
        <Provider>
          <Map {...props} />
        </Provider>
      )
      : <Map {...props} />
  )
}

export default _Map
