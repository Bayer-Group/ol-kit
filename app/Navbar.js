import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

const Nav = styled.div`
  position: fixed;
  justify-content: center;
  display: flex;
  z-index: 9999;
  font-size: 16px;
  opacity: .91;
  background: white;
  width: 320px;
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

export default function Navbar () {
  return (
    <Nav>
      ol-kit demos:
      <Link to='/'>
        <NavLink>
          <NavImg src='https://www.firstdecatur.org/wp-content/uploads/2019/07/Globe-Icon-3.png' title='ol-kit demo' />
        </NavLink>
      </Link>
      <Link to='/space'>
        <NavLink>
          <NavImg src='https://upload.wikimedia.org/wikipedia/commons/d/d0/International_Space_Station.svg' title='space demo' />
        </NavLink>
      </Link>
      <Link to='/covid'>
        <NavLink>
          <NavImg src='https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Biohazard_symbol_%28red%29.svg/520px-Biohazard_symbol_%28red%29.svg.png' title='covid demo' />
        </NavLink>
      </Link>
    </Nav>
  )
}