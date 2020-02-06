import styled from 'styled-components'

export const Preview = styled.div`
  position: absolute;
  display: ${props => !props.width || !props.height ? 'none' : 'block'};
  width: ${props => props.width ? `${props.width}px` : '0px'};
  height: ${props => props.height ? `${props.height}px` : '0px'};
  top: ${props => props.center ? `${props.center[1]}px` : '50%'};
  left: ${props => props.center ? `${props.center[0]}px` : '50%'};
  transform: translate(-50%, -50%);
  pointer-events: none;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.7);
`
