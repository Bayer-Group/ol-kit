import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'

import Navbar from './Navbar'
import Snackbar from './Snackbar'

// routes
import Covid from './routes/covid/App'
import Demo from './routes/demo/App'
import Space from './routes/space/App'

export default function App() {
  return (
    <Router>
      <Snackbar />
      <Navbar />

      <Switch>
        <Route path='/space'>
          <Space />
        </Route>
        <Route path='/covid'>
          <Covid />
        </Route>
        <Route path='/'>
          <Demo />
        </Route>
      </Switch>
    </Router>
  )
}