import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { ProjectMenu } from '@bayer/ol-kit'

const Description = styled.p`
  line-height: 1.5rem;
`

const GridWrapper = styled.div`
  display: flex;
`

const NavLink = styled.div`
  margin: 10px;
`

const NavImg = styled.img`
  height: 50px;
  width: 50px;
`

export default function Welcome ({ desc = 'There\'s a lot you can do with ol-kit. Check out some of these examples.' }) {
  return (
    <div style={{margin: '20px', fontFamily: 'sans-serif'}}>
      <Description>{desc}</Description>
      <h3>Demos</h3>
      <GridWrapper>
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
        <Link to='/geohack'>
          <NavLink>
            <NavImg src='https://cdn4.iconfinder.com/data/icons/award-and-trophy-flat-0619/64/trophy-ribbon-gold-winner-512.png' title='Trophy Icon for Geohack Winners' />
          </NavLink>
        </Link>
        <Link to='/image-exif'>
          <NavLink>
            <NavImg src='https://img.icons8.com/plasticine/2x/camera.png' title='image exif demo' />
          </NavLink>
        </Link>
      </GridWrapper>
      <h3>Project</h3>
      <ProjectMenu />
    </div>
  )
}
