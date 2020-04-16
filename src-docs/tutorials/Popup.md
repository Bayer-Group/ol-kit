# Popup
Popups are great for contextual content, interaction and controls that live relative to the map. A popup can be implemented on your ol-kit `<Map>` with a single-line drop-in.

## Prebuilt, Ready to Go
Since components exported from ol-kit already have a reference to the map (see [connectToMap](../docs/tutorial-connectToMap.html)), you can a slick popup experience out of the box. When a feature or features are clicked, the popup snaps to the edge of the features(s) bounding and also repositions itself on drag to an area that it fits based on the edge of the viewport and other components on the map. This all works without requiring a single prop!
```javascript
import React from 'react'
import { Map, Popup } from '@bayer/ol-kit'

const App = () => {
  return (
    <Map>
      <Popup />
    </Map>
  )
}

export default App
```
That will look something like this (minus the data layer):
![ol-kit logo](../config/jsdoc/template/static/popup-screenshot-1.png)

## Customize
What you're seeing is the default popup with a [PopupDefaultInsert](../docs/PopupDefaultInsert.html) as its child. To pass different children to the popup or create custom functionality checkout the [docs for popup](../docs/Popup.html).
