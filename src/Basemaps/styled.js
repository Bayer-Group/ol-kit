import styled from 'styled-components'

export const Container = styled.div`
  height: auto;
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-evenly;
`

export const BasemapOption = styled.div`
  cursor: pointer;
  height: 100%;
  width: 100%;
  max-width: 130px;
  max-height: 120px;
  margin-top: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  transition: all 0.3s cubic-bezier(.25,.8,.25,1);
  position: relative;
  border-radius: 3px;
  border: ${props => props.isActive ? '3px solid #3f51b5' : 'none'};
`

export const BasemapThumbnail = styled.div`
  width: 100%;
  height: 100%;
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
