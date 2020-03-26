import styled from 'styled-components'

export const Logo = styled.a`
  position: absolute;
  width: 28px;
  bottom: 16px;
  z-index: 1;
  cursor: pointer;
  ${p => p.position === 'left' ? 'left: 16px;' : 'right: 16px;'}
`

export const StyledMap = styled.div`
  height: 100%;
  width: 100%;
  position: ${p => p.fullScreen ? 'fixed' : 'relative'};
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  ${p => p.style};
`
