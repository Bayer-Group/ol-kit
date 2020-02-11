import styled from 'styled-components'

export const StyledMap = styled.div`
  height: 100%;
  width: 100%;
  position: ${p => p.fullScreen ? 'fixed' : 'relative'};
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`
