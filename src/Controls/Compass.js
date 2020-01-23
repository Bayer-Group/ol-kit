import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { connectToMap } from 'Map'
import { CompassContainer } from './styled'
import { rotateMap } from './utils'

const colors = {
  light: {
    background: '#ffffff',
    arrows: '#4d4d4d',
    needleTop: '#e04343',
    needleBottom: '#000000'
  },
  dark: {
    background: '#000000',
    arrows: '#cccccc',
    needleTop: '#e04343',
    needleBottom: '#ffffff'
  }
}

function Compass (props) {
  const { map, variation } = props
  const [radians, setRadians] = useState(map.getView().getRotation())

  useEffect(() => {
    const listener = () => setRadians(map.getView().getRotation())

    map.getView().on('change:rotation', listener)

    return function cleanup() {
      map.getView().un('change:rotation', listener)
    }
  })

  const getRadianOffset = (radians, clockwiseTurn) => {
    return clockwiseTurn
      ? radians + (Math.PI / 8)
      : radians - (Math.PI / 8)
  }
  const rotate = direction => {
    const currentRotation = map.getView().getRotation()
    const clockwiseTurn = direction === 'right'
    // set the rotation to 0 for a north arrow click
    const finalRotation = direction === 'north' ? 0 : getRadianOffset(currentRotation, clockwiseTurn)

    // animate map
    rotateMap(map, finalRotation)
    // animate UI
    setRadians(finalRotation)
  }
  const degrees = radians * 57.296 // the number of degrees per radian

  return (
    <CompassContainer background={colors[variation].background}>
      <svg width='48px' height='48px' viewBox='0 0 48 48' version='1.1' xmlns='http://www.w3.org/2000/svg'>
        <g onClick={() => rotate('left')} transform='translate(8, 11)'>
          <path stroke={colors[variation].arrows} strokeWidth='2' strokeLinecap='square' fill='transparent' d='M6.08917588,0.274482759 C2.08917588,3.50525199 0.0891758754,7.27448276 0.0891758754,11.5821751 C0.0891758754,18.0437135 3.5177473,21.2744828 3.5177473,21.2744828'></path>
          <polygon fill={colors[variation].arrows} transform='translate(5.838799, 24.192853) rotate(143.000000) translate(-5.838799, -24.192853) ' points='5.93396953 20.6928529 8.83879936 27.636638 2.83879936 27.6928529'></polygon>
        </g>
        <g onClick={() => rotate('north')} transform={`translate(18.0, 10.0) rotate(${degrees} 6.0 15.0)`}>
          <polygon fill={colors[variation].needleTop} points='5.74325656 0 11.4865131 15.4007427 0 15.4007427'></polygon>
          <polygon fill={colors[variation].needleBottom} points='5.74325656 30.8014854 0 15.4007427 11.4865131 15.4007427'></polygon>
        </g>
        <g onClick={() => rotate('right')} transform='translate(34.500000, 25.500000) scale(-1, 1) translate(-34.500000, -25.500000) translate(29.000000, 11.000000)'>
          <path stroke={colors[variation].arrows} strokeWidth='2' strokeLinecap='square' fill='transparent' d='M6.08917588,0.274482759 C2.08917588,3.50525199 0.0891758754,7.27448276 0.0891758754,11.5821751 C0.0891758754,18.0437135 3.5177473,21.2744828 3.5177473,21.2744828'></path>
          <polygon fill={colors[variation].arrows} transform='translate(5.838799, 24.192853) rotate(143.000000) translate(-5.838799, -24.192853) ' points='5.93396953 20.6928529 8.83879936 27.636638 2.83879936 27.6928529'></polygon>
        </g>
      </svg>
    </CompassContainer>
  )
}

Compass.defaultProps = {
  variation: 'light'
}

Compass.propTypes = {
  /** reference to Openlayers map object */
  map: PropTypes.object.isRequired,
  /** light or dark variation for styling */
  variation: PropTypes.oneOf(['light', 'dark'])
}

export default connectToMap(Compass)
