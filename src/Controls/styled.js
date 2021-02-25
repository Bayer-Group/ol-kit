import styled from 'styled-components'

export const CompassContainer = styled.div`
  cursor: pointer;
  opacity: 0.75;
  width: ${props => props.size};
  height: ${props => props.size};
  border-radius: ${props => props.size};
  background: ${props => props.background};
  z-index: 1;
  margin: 10px;
  position: relative;
  box-shadow: 1px 2px 5px #757575;

  transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
  &:hover {
    opacity: 1;
  }
`

export const ControlsContainer = styled.div`
  transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
  position: absolute;
  left: ${p => p.position.includes('left') ? '14px' : 'unset'};
  right: ${p => p.position.includes('right') ? '14px' : 'unset'};
  bottom: ${p => p.position.includes('bottom') ? '0px' : 'unset'};
  top: ${p => p.position.includes('top') ? '14px' : 'unset'};
  z-index: 95;
  margin: 0 6px 18px 6px;
  border-radius: 15px;
  display: flex;
  flex-direction: ${props => props.orientation === 'vertical' ? 'column' : 'row'};
  align-items: center;
  justify-content: center;
`

export const ControlGroupContainer = styled.div`
  opacity: 0.75;
  position: relative;
  margin: 8px;
  padding: 3px;
  background: white;
  border-radius: 30px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2), 0 -1px 0px rgba(0,0,0,0.02);
  display: flex;
  flex-direction: ${props => props.orientation === 'vertical' ? 'column' : 'row'};
  align-items: center;
  justify-content: center;

  transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
  &:hover {
    opacity: 1;
  }
`

export const IconSeparator = styled.div`
  width: 50%;
  background: rgb(211, 211, 211);
  height: 1px;
`

export const IconWrapper = styled.div`
  display: flex;
  color: #565656;
  cursor: pointer;

  transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
  &:hover {
    color: #000;
  }
`
