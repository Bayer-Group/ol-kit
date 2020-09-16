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
  width: 400px;
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
  border-radius: 5px;
`
const NavLink = styled.div`
  margin: 10px;
`

export default function App() {
  return (
    <Router>
      <Nav>
        Check out these ol-kit demos:
        <Link to='/'>
          <NavLink>
            Demo
          </NavLink>
        </Link>
        <Link to='/space'>
          <NavLink>
            Space
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