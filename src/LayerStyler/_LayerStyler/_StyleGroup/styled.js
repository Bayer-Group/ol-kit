import styled from 'styled-components'
import { connectToMap } from 'Map'

export const AddNewContainer = styled.div`
  display: flex;
  padding: 15px;
`

export const AddNew = connectToMap(styled.span`
  color: ${p => p.theme.palette.secondary.main};
  cursor: pointer;
  transition: all 0.15s ease-in-out;

  &:hover {
    color: ${p => p.theme.palette.secondary.dark};
  }
`)

export const Card = connectToMap(styled.div`
  margin: 10px;
  padding: 10px 0;
  border-radius: 5px;
  background: ${p => p.theme.palette.background.paper};
  box-shadow: 0px 2px 28px rgba(0, 0, 0, 0.04), 0px 5px 10px rgba(0,0,0,0.1);
`)

export const StyleContainer = styled.div`
  display: flex;
  align-items: center;
  padding-right: 10px;
`

export const AttributeContainer = styled.div`
  display: flex;
`

export const Half = styled.div`
  flex: 1;
  align-items: flex-end;
`

export const DeleteGroup = styled.div`
  text-align: right;
  margin: 20px 22px;
`

export const DeleteGroupText = connectToMap(styled.span`
  cursor: pointer;
  color: ${p => p.theme.palette.secondary.main};
  font-size: 14px;
  transition: all 0.15s ease-in-out;

  &:hover {
    color: ${p => p.theme.palette.secondary.dark};
  }
`)

export const Trashcan = connectToMap(styled.div`
  color: ${p => p.theme.palette.text.secondary};
  font-size: 1.5em;
  vertical-align: top;
  display: flex;
  justify-content: center;
  cursor: pointer;
  margin-top: 15px;
  transition: all 0.15s ease-in-out;

  &:hover {
    color: ${p => p.theme.palette.text.primary};
  }
`)
