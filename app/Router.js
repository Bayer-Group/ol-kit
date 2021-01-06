import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'

// routes
import Covid from './demos/covid/App'
import Space from './demos/space/App'
import Inline from './demos/inline/App'
import World from './demos/world/App'
import Geohack from './demos/geohack/App'
import VectorTiles from './demos/vector-tiles/App'

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
        <Route path='/vector-tiles'>
          <VectorTiles />
        </Route>
        <Route path='/'>
          <World />
        </Route>
      </Switch>
    </Router>
  )
}