import styled from 'styled-components'

export const Container = styled.div`
  height: auto;
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-evenly;
`

export const BasemapSliderContainer = styled.div`
  position: absolute;
  bottom: ${props => props.bottom ? `${props.bottom}px` : '50px'};
  left: ${props => props.left ? `${props.left}px` : '20px'};
  width: 75px;
  height: 75px;
  border-radius: 4px;
  border: 3px solid white;
  box-shadow: 1px 2px 5px #757575;
  transition: .2s;
  z-index: ${props => props.zIndex ? `${props.zIndex}` : `5`};
  ${props => props.style};
`

export const BasemapOption = styled.div`
  cursor: pointer;
  width: 100%;
  height: 100%;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  transition: all 0.3s cubic-bezier(.25,.8,.25,1);
  position: relative;
  border-radius: 3px;
`

export const BasemapThumbnail = styled.div`
  width: 100%;
  height: 100%;
  background: white;
  background-size: cover;
  background-image: url(${props => props.thumbnail});
  ${props => props.blur ? 'filter: blur(0.5px);' : ''};
`

export const Label = styled.label`
  position: absolute;
  bottom: 0;
  width: 100%;
  text-align: center;
  font-size: 12px;
  font-weight: bold;
  color: white;
  text-shadow:
  -1px -1px 0 #000,
  1px -1px 0 #000,
  -1px 1px 0 #000,
  1px 1px 0 #000;
`
