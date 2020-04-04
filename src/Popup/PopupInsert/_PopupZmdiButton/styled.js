import styled from 'styled-components'


export const Icon = styled.button`
  display: inline-block;
  position: relative;
  cursor: pointer;
  padding: 12px;
  outline: none;
  border: 10px;
  background: none;
  font-size: 1.2em;
  vertical-align: inherit;
  color: ${props => props.hover
    ? '#7a736b'
    : '#787878'
}
`
