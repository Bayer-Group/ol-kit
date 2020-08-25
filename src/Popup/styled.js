import styled from 'styled-components'

const positionContainer = (arrowDirection, [x, y], width, height) => {
  if (arrowDirection === 'top') {
    return { top: y + 16, left: x - width / 2 }
  } else if (arrowDirection === 'right') {
    return { top: y - height / 2, left: x - width - 16 }
  } else if (arrowDirection === 'bottom') {
    return { top: y - height - 16, left: x - width / 2 }
  } else if (arrowDirection === 'left') {
    return { top: y - height / 2, left: x + 16 }
  } else if (arrowDirection === 'none') {
    return { top: y, left: x }
  }
}

export const Container = styled.div`
  display: ${p => p.show ? 'block' : 'none'};
  position: ${p => p.inline ? 'relative' : 'absolute'};
  background-color: #FFFFFF;
  font-family: 'ArialMT', 'Arial';
  font-weight: 400;
  z-index: 99;
  opacity: ${p => p.transparent ? 0.8 : 1};
  width: ${p => p.width}px;
  height: ${p => p.height}px;
  left: ${({ arrow, height, pixel, width }) => positionContainer(arrow, pixel, width, height).left}px;
  top: ${({ arrow, height, pixel, width }) => positionContainer(arrow, pixel, width, height).top}px;
  box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.2),
  0px 2px 2px 0px rgba(0, 0, 0, 0.14),
  0px 3px 1px -2px rgba(0, 0, 0, 0.12);
`

export const ArrowBox = styled.div`
  display: ${p => p.unset ? 'none' : 'block'};
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
  ? '#ededed'
  : '#ffffff'};
    border-width: 16px;
    margin-${props => props.position === 'top' || props.position === 'bottom' ? 'left' : 'top'}: -16px;
  }

  &::before {
    border-${props => props.position === 'click' ? 'right' : props.position}-color: rgba(0, 0, 0, 0.12);
    border-width: 17px;
    margin-${props => props.position === 'top' || props.position === 'bottom' ? 'left' : 'top'}: -17px;
  }
`
export const DragHandleIcon = styled.div`
  height: 25px;
  width: 70px;
  ${props => !props.inline && `left: 50vw`};
  ${props => props.inline && `transform: translateY(-100%); margin: auto`};
  cursor: pointer;
  color: ${props => props.color || `#fff`};
  outline:none;
  padding: 3px;
  z-index: 100;
  position: absolute;
  top: 30px;
  left: 0;
  right: 0;
`
