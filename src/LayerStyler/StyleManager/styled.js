import styled from 'styled-components'
import { connectToMap } from 'Map'

export const HeaderContainer = connectToMap(styled.div`
  padding-top: 15px;
  background: ${p => p.theme.palette.divider};
`)

export const InputContainer = styled.div`
  display: inline-block;
  width: 75%;
`

export const FilterContainer = styled.div`
  display: inline-block;
  padding: 36px 0;
  text-align: center;
  vertical-align: top;
`
