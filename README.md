![ol-kit logo](https://raw.github.com/MonsantoCo/ol-kit/master/static/ol-kit-logo.svg?sanitize=true)

![npm version](https://img.shields.io/npm/v/@bayer/ol-kit)

# ol-kit
The easy to use, open source React & Openlayers map component toolkit.

## Getting Started
It's easy to start building map apps with ol-kit. For simple projects the following will get you started:
```javascript
import React from 'react'
import { Map, Popup, Controls, zoomToExtent } from '@bayer/ol-kit'

import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'

class App extends React.Component {
  onMapInit = map => {
    const data = new VectorLayer({
      source: new VectorSource({
        features: [/** get some data and have fun with it */]
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
