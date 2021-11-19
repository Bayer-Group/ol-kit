import styled from 'styled-components'

export const DragBar = styled.div.attrs(({ position }) => ({
  left: `${position - 5}px` // the left position is half of the width subtracted from the position to center the div
}))`
  position: absolute;
  cursor: col-resize;
  top: ${props => props.yOffset || '55'}px;
  width: 10px;
  height: ${props => props.height ? props.height : '100%'};
  background-color: black;
  user-select: none;
  z-index: 999;
  display: flex;
  align-content: center;
  justify-content: center;
  align-items: center;
`
export const SvgIconWrapper = styled.i`
  position: absolute;
  display: flex;
  cursor: col-resize;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0);
 `
