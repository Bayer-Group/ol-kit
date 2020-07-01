import styled from 'styled-components'
import { connectToMap } from 'Map'

export const AttributeSettings = connectToMap(styled.div`
  display: flex;
  padding: 15px 0px 0px 15px;
  align-items: center;
  color: ${props => props.theme.palette.text.secondary};

  &:hover {
    cursor: pointer;
    color: ${props => props.theme.palette.text.primary};
  }
`)

export const HeightContainer = styled.div.attrs(p => ({ 'data-testid': p['data-testid'] }))`
  height: 100%;
`
