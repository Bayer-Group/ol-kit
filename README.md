![ol-kit logo](./config/jsdoc/template/static/readme-ol-kit-logo.png)

![npm version](https://img.shields.io/npm/v/@bayer/ol-kit)

An easy to use, open source [React](https://github.com/facebook/react) & [OpenLayers](https://github.com/openlayers/openlayers) map component toolkit.

Checkout the [demo site here!](https://demo.ol-kit.com/)

## Prebuilt Map Components
![ol-kit logo](./config/jsdoc/template/static/example-screenshot-1.png)

## Installation
Install `ol-kit` and its `peerDependencies`

```bash
npm i @bayer/ol-kit ol@4.6.5 react react-dom styled-components @material-ui/core @material-ui/icons @material-ui/styles --save
```

## Getting Started
It's easy to start building map apps with ol-kit. For simple projects the following will get you started:
```javascript
import React from 'react'
import { Map, Controls, LayerPanel, Popup, loadDataLayer } from '@bayer/ol-kit'

class App extends React.Component {
  onMapInit = async map => {
    console.log('we got a map!', map)
    // nice to have map set on the window while debugging
    window.map = map

    // find a geojson or kml dataset (url or file) to load on the map
    const data = 'https://data.nasa.gov/api/geospatial/7zbq-j77a?method=export&format=KML'
    const dataLayer = await loadDataLayer(map, data)

    console.log('data layer:', dataLayer)
  }

  render () {
    return (
      <Map onMapInit={this.onMapInit}>
        <Controls />
        <LayerPanel />
        <Popup />
      </Map>
    )
  }
}

export default App
```

## Documentation
The documentation for the project is available in the `/docs` directory and the hosted version is available at [ol-kit.com](https://ol-kit.com).

## Bugs & Feature Requests
If you find a bug or think of a new feature, please submit a Github issue.

## Maintainers & Contributions
The current maintainers are listed in [MAINTAINERS.md](https://github.com/MonsantoCo/ol-kit/blob/master/MAINTAINERS.md). If you would like contribute to the project see [CONTRIBUTING.md](https://github.com/MonsantoCo/ol-kit/blob/master/CONTRIBUTING.md).

## Sponsor
The ol-kit project was internally developed at Bayer Crop Science. Without the generous support of various stakeholders at Bayer, this project would never have become an open source reality. Thank you for the support, resources & final approval!

![ol-kit logo](./config/jsdoc/template/static/readme-bayer-logo.png)
