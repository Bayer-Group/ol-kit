import styled from 'styled-components'
import { connectToMap } from 'Map'


export const Icon = connectToMap(styled.button`
  display: inline-block;
  position: relative;
  cursor: pointer;
  padding-bottom: 6px;
  outline: none;
  border: 10px;
  background: none;
  font-size: 1.2em;
  vertical-align: top;
  color: ${props => props.hover
    ? props.theme.palette.text.secondary
    : props.theme.palette.text.primary
}
`)
