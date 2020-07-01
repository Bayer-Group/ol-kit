import styled from 'styled-components'
import { connectToMap } from 'Map'


export const TabsContainer = connectToMap(styled.div`
  color: ${p => p.theme.palette.divider};
  height: 100%;
  width: 100%;
  display: flex;
  z-index: 1100;
  box-sizing: border-box;
  flex-shrink: 0;
  flex-direction: column;
`)

export const TabList = connectToMap(styled.div`
  display: inline-block;
  position: relative;
  white-space: nowrap;
  background-color: ${p => p.theme.palette.background.paper};
  width: 100%;
  overflow-x: hidden;
  margin-bottom: 0;
  min-height: 50px;
`)

export const Flex = styled.div`
  display: flex;
`

export const FlexContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
`

export const TabButton = connectToMap(styled.button`
    flex: none;
    flex-grow: 1;
    height: 50px;
    padding: 0;
    position: relative;
    overflow: hidden;
    min-width: 72px;
    max-width: 264px;
    font-size: 0.8em;
    font-weight: 500;
    text-transform: uppercase;
    color: inherit;
    cursor: pointer;
    margin: 0;
    border: 0;
    display: inline-flex;
    outline: none;
    user-select: none;
    align-items: center;
    border-radius: 0;
    vertical-align: middle;
    justify-content: center;
    -moz-appearance: none;
    text-decoration: none;
    background-color: transparent;
    -webkit-appearance: none;
    -webkit-tap-highlight-color: transparent;
    transition: .1s;
    color: ${props => props.selected ? props.theme.palette.text.primary : props.theme.palette.text.secondary};
`)


export const TabSlider = connectToMap(styled.span`
  background-color: ${p => p.theme.palette.secondary.main};
  width: 100%;
  height: 3px;
  bottom: 0;
  position: absolute;
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
`)
