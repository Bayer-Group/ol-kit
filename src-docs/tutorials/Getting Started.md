# Getting Started

Getting started with ol-kit is simple. We assume you already have a React application. If not, you can use something like [Create React App](https://create-react-app.dev/). There are a few `peerDependencies` required by ol-kit that need to be installed on your side (this avoids problems introduced by having multiple instances of these dependencies). For a comprehensive install use:
```
npm i @bayer/ol-kit ol@4.6.5 react react-dom styled-components @material-ui/core @material-ui/icons --save
```

##### _Why ol@4.6.5?_
ol-kit is a byproduct of an internal mapping framework at Bayer Crop Science that is running on an older version of OpenLayers. We would like to get to the latest but it will just take some time and effort- follow [this issue](https://github.com/MonsantoCo/ol-kit/issues/44) to stay up to date on the migration.
##### **important!** Make sure you use the [OpenLayers docs for this version](https://openlayers.org/en/v4.6.5/apidoc/).

## Let's Get a Map on the Page
There are two ways to get started making a map: let ol-kit generate a default map for you or pass in a custom `ol.Map`. (note: the below examples use both classical and functional components from React- ol-kit works with both of these syntaxes.)

### Auto-Generate a Map
To get started quickly, you can let ol-kit create an `ol.Map` by simply importing & rendering the `Map` component.
```javascript
import React from 'react'
import { Map } from '@bayer/ol-kit'

const MyApp = () => <Map />
```

Without a reference to the map ol-kit created, you can't do anything useful. You can get around this by passing the `onMapInit` prop. This callback is called with one argument: an `ol.Map` instance created by ol-kit. Your application should save this for later interaction with the map and other OpenLayers APIs. (note: the map can also be passed implicitly by wrapping components with `connectToMap` util- learn about [how that works](../docs/tutorial-connectToMap.html))
```javascript
import React from 'react'
import { Map } from '@bayer/ol-kit'

function App () {
  const onMapInit = map => {
    console.log('we got a map!', map)
  }

  return (
    <Map onMapInit={onMapInit} />
  )
}

export default App
```


### Pass a Custom Map
If you prefer creating your own `ol.Map` you can ignore the `onMapInit` prop and instead pass the `map` prop like so:
```javascript
import React, { Component } from 'react'
import { Map } from '@bayer/ol-kit'
import olMap from 'ol/map'

class App extends Component {
  constructor(props) {
    super(props)

    this.myMap = new olMap({...})
  }

  render () {
    return (
      <Map map={this.myMap} />
    )
  }
}

export default App
```

## Child Components
Applications will need to render children which overlay on top of the map and interact with it. Even though the ol-kit `Map` component renders a map to the page, it also includes a wrapper container allowing you to render custom application components as `children`. It can be as simple as a popup or a full-fledged routed application.

In the example below, the `Popup` and `Controls` components will be rendered "within" the bounds of the map and on top of the map surface.

```javascript
import React from 'react'
import { Map, Controls, Popup } from '@bayer/ol-kit'

function App () {
  const onMapInit = map => {
    console.log('we got a map!', map)
  }

  return (
    <Map onMapInit={onMapInit}>
      <Controls />
      <Popup />
    </Map>
  )
}

export default App
```

## Next Steps
Now that you have a map rendered, you probably want to make it awesome. Check out the components and tutorials provided by ol-kit that make it easy to add info popups, layer management, drawing capability, URI location tracking and much more.
