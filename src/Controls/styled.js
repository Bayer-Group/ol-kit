import styled from 'styled-components'

export const CompassContainer = styled.div`
  cursor: pointer;
  width: 48px;
  height: 48px;
  right: 7px;
  border-radius: 55px;
  background: ${props => props.background};
  z-index: 1;
  position: relative;
  box-shadow: 1px 2px 5px #757575;
`

export const ControlsContainer = styled.div`
  transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
  position: absolute;
  left: ${p => p.position.includes('left') ? '14px' : 'unset'};
  right: ${p => p.position.includes('right') ? '14px' : 'unset'};
  bottom: ${p => p.position.includes('bottom') ? '0px' : 'unset'};
  top: ${p => p.position.includes('top') ? '14px' : 'unset'};
  z-index: 95;
  width: 34px;
  margin: 0 6px 18px 6px;
`

export const Icon = styled.div`
  cursor: pointer;
  width: 33px;
  height: 26px;
  text-align: center;
  padding-top: 8px;
  transition: all 0.2s;
  background: white;
  &:hover {
    background: #f3f3f3;
  }
`

export const IconSeparator = styled.div`
  width: 50%;
  background: rgb(211, 211, 211);
  height: 1px;
  margin: auto;
`

export const IconsContainer = styled.div`
  background: white;
  border-radius: 2px;
  box-shadow: 1px 2px 5px #757575;
  width: 34px;
  margin: 0 6px 12px 0px;
`
