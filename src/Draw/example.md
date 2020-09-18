# DrawContainer
The `<DrawContainer>` component will render a set prebuilt draw and measure tools or child component(s) passed in as the `children` prop. These tools allow the user to draw features with point, line, and polygon geometries on a map user configurable geometry snap settings. These features can also be styled with perimiter and area measurement labels. Measurements are calculated geodesically using the WGS84 ellipsoid. The user can also label the geometry vertices with their respective coordinates in decimal degrees.

## Drop-in example:
This one-liner will render prebuilt draw components in a map.
```javascript static
import React from 'react'
import { Map, DrawContainer } from '@bayer/ol-kit'

const App = () => {
  return (
  <Map>
    <DrawContainer />
  </Map>
  )
}

export default App
```