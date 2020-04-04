# Getting Started

Getting started with ol-kit is simple. We assume you already have a React application. If not, you can use something like [Create React App](https://create-react-app.dev/). Then simply `npm i @bayer/ol-kit --save` and you're ready to go. There are a few `peerDependencies` required as well. For a comprehensive install use:
```
npm i @bayer/ol-kit ol@4.6.5 react react-dom styled-components --save
```

There are two ways to get started with ol-kit.

### Auto-Generate a Map
To get started quickly, you can let ol-kit create an `ol.Map` by simply importing & rendering `Map`.
```javascript
import { Map } from '@bayer/ol-kit'

const MyApp = () => <Map />
```

Without a reference to the map ol-kit created, you can't do anything useful. You can get around this by passing the `onMapInit` prop. This callback is passed one argument: an `ol.Map` instance created by ol-kit. Your application should save this for later interaction with the map and other Openlayers APIs.
```javascript
import { Component } from 'react'
import { Map } from '@bayer/ol-kit'

class App extends Component {
  onMapInit = map => {}

  render () {
    return (
      <Map onMapInit={this.onMapInit} />
    )
  }
}
```


### Pass a Custom Map
If you prefer creating your own `ol.Map` you can ignore the `onMapInit` prop and instead pass the `map` prop like so:
```javascript
import { Component } from 'react'
import { Map } from '@bayer/ol-kit'
import olMap from 'ol/Map'

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
```

## Child Components
Applications will need to render children which overaly on top of the map and interact with it. Even though the ol-kit `Map` component renders a map to the page, it also includes a wrapper container allowing you to render custom application components as `children`. It can be as simple as a popup or a full-fledged routed application.

In the example below, the `Popup` and `Controls` components will be rendered "within" the bounds of the map and on top of the map surface.

```javascript
import { Component } from 'react'
import { Map, Controls } from '@bayer/ol-kit'

class App extends Component {
  onMapInit = map => {}

  render () {
    return (
      <Map onMapInit={this.onMapInit}>
        <Controls />
      </Map>
    )
  }
}
```

## Next Steps
Now that you have a map rendered, you probably want to make it awesome. Check out the components and tutorials provided by ol-kit that make it easy to add info popups, layer management, drawing capability, URI location tracking and much more.
