import styled from 'styled-components'
import { connectToMap } from 'Map'

export const Container = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-end;
`

export const DeleteAll = connectToMap(styled.div`
  font-size: 10px;
  color: ${p => p.theme.palette.secondary.main};
  text-align: center;
  cursor: pointer;
`)

export const Half = styled.div`
  display: flex;
  flex: 1;
`

export const Fourth = styled.div`
  display: flex;
  flex-direction: column;
  wtitleth: 15%;
  vertical-align: top;
`

export const Title = connectToMap(styled.div`
  font-size: 10px;
  /* text-transform: uppercase; */
  color: ${props => props.color ? props.color : props.theme.palette.text.secondary};
  text-align: center;
`)
