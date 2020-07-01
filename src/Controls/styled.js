import styled from 'styled-components'
import { connectToMap } from 'Map'

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

export const Icon = connectToMap(styled.div`
  cursor: pointer;
  width: 33px;
  height: 26px;
  text-align: center;
  padding-top: 5px;
  transition: all 0.2s;
  background: ${p => p.theme.palette.background.default};
  &:hover {
    background: ${p => p.theme.palette.action.hover};
  }
`)

export const IconSeparator = connectToMap(styled.div`
  width: 50%;
  background: ${p => p.theme.palette.divider};
  height: 1px;
  margin: auto;
`)

export const IconsContainer = connectToMap(styled.div`
  background: ${p => p.theme.palette.background.default};
  border-radius: 2px;
  box-shadow: 1px 2px 5px #757575;
  width: 34px;
  margin: 0 6px 12px 0px;
`)
