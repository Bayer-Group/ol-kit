import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Logo } from './styled'
import OL_KIT_MARK from 'images/ol_kit_mark.svg'
import OL_KIT_MARK_BLACK from 'images/ol_kit_mark_black.svg'

export default function MapLogo (props) {
  const { mapLogoPosition } = props
  const [isHovered, setHovered] = useState(false)

  return (
    mapLogoPosition === 'none'
      ? null
      : (
        <Logo
          position={mapLogoPosition}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          title='Powered by ol-kit'
          href='https://ol-kit.com/'
          target='_blank'>
          {isHovered
            ? <OL_KIT_MARK />
            : <OL_KIT_MARK_BLACK />
          }
        </Logo>
      )
  )
}

MapLogo.defaultProps = {
  mapLogoPosition: 'left'
}

MapLogo.propTypes = {
  mapLogoPosition: PropTypes.string
}
