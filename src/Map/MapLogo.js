import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { LogoContainer, Logo, LogoText } from './styled'
import OL_KIT_MARK from 'images/ol_kit_mark.svg'
import OL_KIT_MARK_BLACK from 'images/ol_kit_mark_black.svg'

export default function MapLogo (props) {
  const { logoPosition, translations } = props
  const [isHovered, setHovered] = useState(false)

  return (
    logoPosition === 'none'
      ? null
      : (
        <LogoContainer position={logoPosition}>
          <LogoText>{translations['_ol_kit.MapLogo.title']}</LogoText>
          <Logo
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            title={translations['_ol_kit.MapLogo.hover']}
            href='https://ol-kit.com/'
            target='_blank'>
            {isHovered
              ? <OL_KIT_MARK id={'_ol_kit_logo'} />
              : <OL_KIT_MARK_BLACK id={'_ol_kit_logo'} />
            }
          </Logo>
        </LogoContainer>
      )
  )
}

MapLogo.defaultProps = {
  logoPosition: 'right'
}

MapLogo.propTypes = {
  logoPosition: PropTypes.string,
  translations: PropTypes.object
}
