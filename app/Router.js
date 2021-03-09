import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'

// routes
import Covid from './demos/covid/App'
import Heatmap from './demos/heatmap/App'
import Space from './demos/space/App'
import Inline from './demos/inline/App'
import MultiMap from './demos/multi/App'
import World from './demos/world/App'
import Geohack from './demos/geohack/App'
import VectorTiles from './demos/vector-tiles/App'
import ImageExif from './demos/image-exif/App'

export default function App () {
  return (
    <Router>
      <Switch>
        <Route path='/geohack'>
          <Geohack />
        </Route>
        <Route path='/covid'>
          <Covid />
        </Route>
        <Route path='/space'>
          <Space />
        </Route>
        <Route path='/inline'>
          <Inline />
        </Route>
        <Route path='/heatmap'>
          <Heatmap />
        </Route>
        <Route path='/image-exif'>
          <ImageExif />
        </Route>
        <Route path='/vector-tiles'>
          <VectorTiles />
        </Route>
        <Route path='/multi'>
          <MultiMap />
        </Route>
        <Route path='/'>
          <World />
        </Route>
      </Switch>
    </Router>
  )
}
