import styled from 'styled-components'
import { connectToMap } from 'Map'

export const Action = styled.div`
  cursor: pointer;
`

export const Item = connectToMap(styled.div`
  padding: 12px 15px;
  font-size: 15px;
  color: ${props => props.disabled ? props.theme.palette.text.disabled : props.theme.palette.text.primary};

  &:hover {
    background: ${props => props.theme.palette.action.hover};
  }
`)
