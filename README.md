# ol-kit
Easy to use, open source, geospatial toolkit- built with mapping library [OpenLayers](https://github.com/openlayers/openlayers) & component library [React](https://github.com/facebook/react).

## Getting Started
Install `ol-kit` and few `peerDependencies` required by this library:

```
npm i @bayer/ol-kit ol@4.6.5 react react-dom styled-components --save
```

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
