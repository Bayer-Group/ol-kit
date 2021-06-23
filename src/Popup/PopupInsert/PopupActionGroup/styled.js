import styled from 'styled-components'


export const Container = styled.span`
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
    color: rgba(0, 0, 0, 0.87);
    line-height: 32px;
    transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
    min-height: 32px;
    white-space: nowrap;
    user-select: none;
    background-color: ${props => props.hover ? '#f2f2f2' : 'white'};
`

export const ActionIcon = styled.div`
    display: inline-flex;
    justify-content: flex-end;
    align-items: center;
    cursor: pointer;
    font-size: 1.5em;
    width: 100%;
    margin: 0 5px;
`

export const Flyout = styled.div`
  position: absolute;
  background-color: white;
  width: 192px;
  font-family: 'ArialMT','Arial';
  z-index: 100;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px;
  left: ${p => p.left}px;
  top: ${p => p.top}px;
  display: ${p => p.showFlyout ? 'block' : 'none'};
`

export const Title = styled.span``
