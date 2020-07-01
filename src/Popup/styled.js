import styled from 'styled-components'
import { connectToMap } from 'Map'

const positionContainer = (arrowDirection, [x, y], width, height) => {
  if (arrowDirection === 'top') {
    return { top: y + 16, left: x - width / 2 }
  } else if (arrowDirection === 'right') {
    return { top: y - height / 2, left: x - width - 16 }
  } else if (arrowDirection === 'bottom') {
    return { top: y - height - 16, left: x - width / 2 }
  } else if (arrowDirection === 'left') {
    return { top: y - height / 2, left: x + 16 }
  } else {
    return { top: y, left: x }
  }
}

export const Container = connectToMap(styled.div`
  display: ${p => p.show ? 'block' : 'none'};
  position: ${p => p.inline ? 'relative' : 'absolute'};
  background-color: ${p => p.theme.palette.background.default};
  font-family: 'ArialMT', 'Arial';
  font-weight: 400;
  z-index: 99;
  width: ${p => p.width}px;
  height: ${p => p.height}px;
  left: ${({ arrow, height, pixel, width }) => positionContainer(arrow, pixel, width, height).left}px;
  top: ${({ arrow, height, pixel, width }) => positionContainer(arrow, pixel, width, height).top}px;
  box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.2),
  0px 2px 2px 0px rgba(0, 0, 0, 0.14),
  0px 3px 1px -2px rgba(0, 0, 0, 0.12);
`)

export const ArrowBox = connectToMap(styled.div`
  &::after, &::before {
    ${props => props.position === 'click' ? 'right' : props.position}: 100%;
    ${props => props.position === 'top' || props.position === 'bottom' ? 'left' : 'top'}: 50%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
  }

  &::after {
    border-${props => props.position === 'click' ? 'right' : props.position}-color: ${props => props.position === 'bottom'
  ? props.theme.palette.divider
  : props.theme.palette.background.default};
    border-width: 16px;
    margin-${props => props.position === 'top' || props.position === 'bottom' ? 'left' : 'top'}: -16px;
  }

  &::before {
    border-${props => props.position === 'click' ? 'right' : props.position}-color: ${props => props.theme.palette.divider};
    border-width: 17px;
    margin-${props => props.position === 'top' || props.position === 'bottom' ? 'left' : 'top'}: -17px;
  }
`)
