import styled from 'styled-components'
import { connectToMap } from 'Map'

export const CloseIcon = styled.i`
  margin-right: 10px;
  cursor: pointer;
`

export const ContentContainer = styled.div`
  padding: 20px;
  min-width: 420px;
  min-height: 80px;
`

export const InputContainer = styled.div`
  display: inline-block;
  width: 180px;
`

export const Row = connectToMap(styled.div`
  margin: 10px 0px;
  width: 100%;

  span {
    color: ${p => p.theme.palette.secondary.light};
    cursor: pointer;
  }
`)

export const TextContainer = styled.div`
  display: inline-block;
  text-align: center;
  padding: 4px;
  width: 60px;
`

export const Title = connectToMap(styled.h4`
  color: ${p => p.theme.palette.text.primary};
  font-size: 1em;
`)
