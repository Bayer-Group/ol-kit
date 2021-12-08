import styled from 'styled-components'

export const Button = styled.button`
  border: 1px solid #353535;
  border-radius: 2px;
  padding: 2px 6px;
  background: white;
  margin-top: 20px;
  font-size: 12px;
  color: #353535;
`

export const Container = styled.div`
  width: 100%;
  height: 100%;
  color: #ca2525;
  text-align: center;
  ${props => props.floating ? `
    position: absolute;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    margin: auto;
    background: white;
    width: 250px;
    height: 250px;
    border-radius: 4px;`
    : null
}
`

export const FloatingBackground = styled.div`
  ${props => props.floating ? `
    background: #000000ab;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    position: absolute;`
    : null
}
`

export const Header = styled.h1`
  font-size: 20px;
  padding-top: 20px;
`

export const Message = styled.em`
  display: block;
  color: #353535;
  font-size: 12px;
`
