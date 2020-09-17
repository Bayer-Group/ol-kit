The Provider component should wrap your entire application and never be unmounted. It will automatically interface with any ol-kit children within the component tree and connect them to context for things like `map`, `translations` and `selectInteraction` props. A `<Map>` mounts a `<Provider>` for you behind the scenes, but if you mount `<Provider>` declaratively (see below), components do not have to be children of `<Map>` (only `<Provider>`).

Fully integrated example:
```javascript static
import React from 'react'
import { Map, Popup, Provider } from '@bayer/ol-kit'

function App() {
  return (
    <Provider>
      <Map />
      <Popup />
    </Provider>
  )
}

export default App
```
Make sure the <Provider> never unmounts!