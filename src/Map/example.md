# Map
The `<Map>` component will either create an [OpenLayers map](https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html) for you or take a prebuilt map as a prop. A reference to this map will be passed down via props to ol-kit child components of `<Map>` via [`connectToContext`](../connectToContext/example.md).

## Drop-in example:
This one-liner will create a map + div with the id of `_ol_kit_map_{uuid}` & render the map into that div.
```javascript static
import React from 'react'
import { Map } from '@bayer/ol-kit'

const App = () => {
  return (
    <Map />
  )
}

export default App
```


## Callback example:
`onMapInit` is not required but it will be called on [`componentDidMount`](https://reactjs.org/docs/react-component.html#componentdidmount) and return a reference to the newly created OpenLayers map (in case you want to manipulate it).
```javascript static
import React from 'react'
import { Map } from '@bayer/ol-kit'

import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'

class App extends React.Component {
  onMapInit = map => {
    const data = new VectorLayer({
      source: new VectorSource({
        features: [/** Get some data and have fun with it */]
      })
    })

    // add the data to the map
    map.addLayer(data)
  }

  render () {
    return (
      <Map onMapInit={this.onMapInit} />
    )
  }
}

export default App
```

## Prop example:
Make sure the passed map is created before `<Map>` is mounted; if the `map` prop is falsey on mount, `<Map>` will create it's own map instead (and return it via `onMapInit`).
```javascript static
import React from 'react'
import { Map, Popup, Controls } from '@bayer/ol-kit'

import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'

class App extends React.Component {
  constructor () {
    super()

    // create new openlayers map
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
      target: 'map'
    })

    this.state = {
      map
    }
  }

  render () {
    const { map } = this.state

    // create a div for the map to render into with an id matching the target
    return (
      <React.Fragment>
        <div id='map'></div>
        <Map map={map} />
      </React.Fragment>
    )
  }
}

export default App
```
