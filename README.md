# ol-kit
Easy to use, open source React/Openlayers component toolkit.

## Getting Started
It's easy to start building map apps with olKit. For simple projects the following will get you started:
```javascript
import React from 'react'
import { Map, Popup, Controls } from 'olKit/components'
import { zoomToExtent } from 'olKit/utils'

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

    // quickly take the map
    zoomToExtent([0, 0], 12)
  }

  render () {
    return (
      <Map onMapInit={this.onMapInit}>
        <Popup />
        <Controls />
      </Map>
    )
  }
```
