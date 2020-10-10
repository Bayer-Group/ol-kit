import styled from 'styled-components'

export const LogoContainer = styled.div`
  width: 100%;
  position: absolute;
  display: flex;
  justify-content: ${props => props.position === 'right' ? 'flex-end' : 'flex-start'};
  align-items: flex-end;
  bottom: 1px;
  z-index: 1;
`

export const Logo = styled.a.attrs(props => ({
  title: props.title
}))`
  width: 15px;
  height: 15px;
  padding: 2px;
  cursor: pointer;
`

export const LogoText = styled.p`
  font-size: 11px;
  font-family: Roboto,Arial,sans-serif;
  padding-left: 2px;
  margin: 0px;
`

export const StyledMap = styled.div`
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  ${p => p.style};
`
