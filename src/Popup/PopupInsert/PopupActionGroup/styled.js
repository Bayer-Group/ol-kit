import styled from 'styled-components'
import { connectToMap } from 'Map'

export const Container = connectToMap(styled.span`
    display: flex;
    position: relative;
    border: 10px;
    box-sizing: border-box;
    cursor: pointer;
    text-decoration: none;
    padding: 10px 15px;
    outline: none;
    font-size: 15px;
    font-weight: inherit;
    color: ${props => props.theme.palette.text.primary};
    line-height: 32px;
    transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
    min-height: 32px;
    white-space: nowrap;
    user-select: none;
    background-color: ${props => props.hover ? props.theme.palette.action.hover : props.theme.palette.background.default};
`)

export const ActionIcon = styled.div`
    display: inline-flex;
    justify-content: flex-end;
    align-items: center;
    cursor: pointer;
    font-size: 1.5em;
    width: 100%;
    margin: 0 5px;
`

export const Flyout = connectToMap(styled.div.attrs({
  style: ({ left, top, showFlyout }) => ({
    left: `${left}px`,
    top: `${top}px`,
    display: showFlyout ? 'block' : 'none'
  })
})`
  position: fixed;
  background-color: ${props => props.theme.palette.background.default};
  width: 192px;
  z-index: 2;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px;
`)

export const Title = styled.span``
