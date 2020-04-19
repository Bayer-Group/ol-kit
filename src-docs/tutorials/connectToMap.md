# connectToMap
The `connectToMap` wrapping function that automatically passes an `ol.Map` to its children.

## How does it work?
When the `Map` component is constructed, it attaches the OpenLayers map to a [context](https://reactjs.org/docs/context.html). If this context exists (which means `Map` has been constructed), `connectToMap` renders it's child with a prop of `map` from the `Map` parent and also spreads the rest of the inline props. If a `Map` is not mounted, `connectToMap` will just render the child and pass props through without consuming a context.

## Automatic Example
All components provided by ol-kit are already wrapped, so a single-line drop-in is all you need to get it working:
```javascript
import React from 'react'
import { Map, Popup } from '@bayer/ol-kit'

const App = () => {
  return (
    <Map>
      <Popup /> {/* This component was automatically given a map prop */}
    </Map>
  )
}

export default App
```

## Manual Example
If you prefer to not use the `Map` component you must manually pass the `map` prop to all ol-kit components:
```javascript
import React from 'react'
import { Map, Popup } from '@bayer/ol-kit'

const App = () => {
  return (
    <div>
      <Popup map={yourOlMap} />
    </div>
  )
}

export default App
```

## Wrapping Your Components
Prebuilt ol-kit components get wrapped by this consumer before they are exported so they can be dropped in and just work. If you want to leverage the same logic, wrap your custom component like so:
```javascript
import React from 'react'
import PropTypes from 'prop-types'
import { connectToMap } from '@bayer/ol-kit'

const CustomMapComponent = props => {
  const { map } = props

  // do some logic with the map

  return (
    <div>This component has map as a prop!</div>
  )
}

CustomMapComponent.propTypes = {
  map: PropTypes.object.isRequired
}

export default connectToMap(CustomMapComponent)
```
