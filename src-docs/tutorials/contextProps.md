# contextProps
Use `contextProps` to add custom props to the global [context](https://reactjs.org/docs/context.html) instantiated by ol-kit.

## How does it work?
When the `<Map>` component is constructed, a [context](https://reactjs.org/docs/context.html) is instantiated that passes useful props like `map` down to any component wrapped with [connectToContext](./tutorial-connectToContext.html). You can add your own custom props to this context one of two ways:

### Let's say you have this component that needs access to global state...
Maybe it's deeply nested or rendered in a way where passing props down the component tree is not ideal. Maybe something like this:
```javascript
import React from 'react'
import PropTypes from 'prop-types'
import { connectToContext } from '@bayer/ol-kit'
import Container from './Container' // made up styling component

const CustomMapWidget = props => {
  const { restrictedLayers, theme } = props

  return (
    <Container theme={theme}>
      <h1>This component has restrictedLayers as a prop from context!</h1>
      {restrictedLayers.map((layer, i) => <div key={i}>{layer.title}</div>)}
    </Container>
  )
}

CustomMapWidget.propTypes = {
  restrictedLayers: PropTypes.array.isRequired,
  theme: PropTypes.string.isRequired
}

export default connectToContext(CustomMapWidget)
```

## onMapInit Example
It's common get data that needs to live in global state from an asyncronous network call. A great place for this to be attached is by returning an object with `contextProps` from the `onMapInit` callback.
```javascript
import React from 'react'
import { Map } from '@bayer/ol-kit'
import CustomMapWidget from './CustomMapWidget' // made up component (see above)
import { fetchRestrictedLayers } from './utils' // made up util for async data fetching

const App = () => {
  const onMapInit = async map => {
    const restrictedLayers = await fetchRestrictedLayers()
    const contextProps = {
      restrictedLayers,
      theme: 'dark'
    }

    return { contextProps } // this is the magic right here
  }

  return (
    <Map onMapInit={onMapInit}>
      <CustomMapWidget /> {/* This component was automatically given context props when wrapped by connectToContext above */}
    </Map>
  )
}

export default App
```

## Inline Props Example
It's common get data that needs to live in global state from an asyncronous network call. A great place for this to be attached is by returning an object with `contextProps` from the `onMapInit` callback.
```javascript
import React from 'react'
import { Map } from '@bayer/ol-kit'
import CustomMapWidget from './CustomMapWidget' // made up component (see above)
import { fetchRestrictedLayers } from './utils' // made up util for async data fetching

const App = () => {
  const onMapInit = async map => {
    const restrictedLayers = await fetchRestrictedLayers()
    const contextProps = {
      restrictedLayers,
      theme: 'dark'
    }

    return { contextProps } // this is the magic right here
  }

  return (
    <Map>
      <CustomMapWidget /> {/* This component was automatically given context props when wrapped by connectToContext above */}
    </Map>
  )
}

export default App
```