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
import Container from './Container' // made up styled component

const CustomMapWidget = props => {
  const { activeData, preferences, theme } = props

  return (
    <Container preferences={preferences} theme={theme}>
      <h1>This component has `activeData`, `preferences` and `theme` as props from context!</h1>

      <h3>Active Data:</h3>
      <ul>
        {activeData.map(data => <li>{data.value}</li>)}
      </ul>
    </Container>
  )
}

CustomMapWidget.propTypes = {
  activeData: PropTypes.array.isRequired,
  preferences: PropTypes.array.isRequired,
  theme: PropTypes.string.isRequired
}

export default connectToContext(CustomMapWidget)
```

## onMapInit Example (one-time set to context)
It's common get data from an asyncronous network call after the map initializes that needs to live in global state. A great place for this to be attached to context is by returning an object with `contextProps` from the `onMapInit` callback.
```javascript
import React from 'react'
import { Map } from '@bayer/ol-kit'
import CustomMapWidget from './CustomMapWidget' // made up component (see above)
import { fetchPreferences } from './utils' // made up util for async data fetching

const App = () => {
  const onMapInit = async map => {
    const preferences = await fetchPreferences()
    const contextProps = {
      preferences,
      theme: 'dark'
    }

    return { contextProps } // contextProps in this object get attached to context
  }

  return (
    <Map onMapInit={onMapInit}>
      <CustomMapWidget /> {/* This component was automatically given context props when wrapped by connectToContext above */}
    </Map>
  )
}

export default App
```

## Inline Props Example (continually update context)
You can also store data in component state and pass props inline to `<Map>` to be added to context. This approach is nice if `contextProps` are often changing after the initial load.
```javascript
import React, { useEffect, useState } from 'react'
import { Map } from '@bayer/ol-kit'
import CustomMapWidget from './CustomMapWidget' // made up component (see above)
import { fetchLatestData } from './utils' // made up util for async data fetching

const App = () => {
  const [contextProps, setContextProps] = useState({})
  const fetchData = async () => {
    const activeData = await fetchLatestData()
    const contextProps = {
      activeData
    }

    setContextProps(contextProps)
  }

  useEffect(() => {
    fetchData()
  })

  return (
    <Map contextProps={contextProps}>
      <CustomMapWidget /> {/* This component was automatically given context props when wrapped by connectToContext above */}
    </Map>
  )
}

export default App
```