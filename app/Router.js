import React from 'react'
import styled from 'styled-components'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from 'react-router-dom'

import Snackbar from './Snackbar'

// routes
import Demo from './routes/demo/App'
import Space from './routes/space/App'

const Nav = styled.div`
  position: fixed;
  justify-content: center;
  display: flex;
  z-index: 99999999;
  font-size: 16px;
  opacity: .91;
  background: white;
  width: 250px;
  margin: 0;
  top: 0;
  right: 0;
  height: 80px;
  padding: 12px;
  top: 0;
  right: 0;
  height: 55px;
  align-items: center;
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  border-radius: 2px;
`
const NavLink = styled.div`
  margin: 10px;
`
const NavImg = styled.img`
  height: 50px;
  width: 50px;
`

export default function App() {
  return (
    <Router>
      <Snackbar />
      <Nav>
        ol-kit demos:
        <Link to='/'>
          <NavLink>
            <NavImg src='https://www.firstdecatur.org/wp-content/uploads/2019/07/Globe-Icon-3.png' title='' />
          </NavLink>
        </Link>
        <Link to='/space'>
          <NavLink>
            <NavImg src='https://upload.wikimedia.org/wikipedia/commons/d/d0/International_Space_Station.svg' />
          </NavLink>
        </Link>
      </Nav>

      <Switch>
        <Route path='/space'>
          <Space />
        </Route>
        <Route path='/'>
          <Demo />
        </Route>
      </Switch>
    </Router>
  )
}