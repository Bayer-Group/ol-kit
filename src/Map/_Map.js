import React from 'react'
import Map from './Map' // this should be the only relative ./Map import in ol-kit
import { Provider } from 'Provider'
import { MultiMapContext } from 'MultiMapManager'
import { ErrorBoundary } from 'ErrorBoundary'

// check for MultiMapManager so Provider wrapper does not also render a context
function _Map (props) {
  return (
    !MultiMapContext
      ? (
        <ErrorBoundary floating={true}>
          <Provider {...props}>
            <Map {...props} />
          </Provider>
        </ErrorBoundary>
      )
      : <Map {...props} />
  )
}

export default _Map
