import React from 'react'
import Map from './Map' // this should be the only relative ./Map import in ol-kit
import { Provider } from 'Provider'

/* this becomes a ternary once <Provider> multi-map is available
   !ProviderContext
      ? (
        <Provider>
          <Map {...props} />
        </Provider>
      )
      : <Map {...props} />
*/
function _Map (props) {
  return (
    <Provider>
      <Map {...props} />
    </Provider>
  )
}

export default _Map
