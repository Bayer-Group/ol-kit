import styled from 'styled-components'
import { connectToMap } from 'Map'

export const ButtonContainer = styled.div`
  padding: 2px 16px;
  margin-top: 10px;
  display: flex;
`

export const Button = connectToMap(styled.div`
  user-select: none;
  display: inline-block;
  color: ${p => p.theme.palette.secondary.main};
  cursor: pointer;
  width: 25%;
  font-size: 12px;
  transition: all 0.15s ease-in-out;

  &:hover {
    color: ${p => p.theme.palette.secondary.dark};
  }
`)

export const StyleGroupHeading = connectToMap(styled.span`
  display: flex;
  flex-wrap: nowrap;
  font-weight: 500;
  color: ${p => p.theme.palette.action.active};
  line-height: 32px;
  align-items: center;
`)

export const AddNew = connectToMap(styled.div`
  display: flex;
  margin: 0 10px;
  color: ${p => p.theme.palette.secondary.main};
  cursor: pointer;
  transition: all 0.15s ease-in-out;

  &:hover {
    color: ${p => p.theme.palette.secondary.dark};
  }
`)

export const ResetText = connectToMap(styled.div`
  display: inline;
  font-weight: 400;
  font-size: 12px;
  padding-left: 15px;
  color: ${p => p.theme.palette.secondary.main};
  cursor: pointer;
  transition: all 0.15s ease-in-out;

  &:hover {
    color: ${p => p.theme.palette.secondary.dark};
  }
`)

export const Half = styled.div`
  flex: 1;
  display: flex;
`

export const CollapseText = styled.div`
  display: flex;
  flex: 1;
  text-align: right;
  line-height: 32px;
`

export const Fourth = styled.div`
  display: inline-block;
  width: 25%;
  vertical-align: top;
`

export const Text = connectToMap(styled.div`
  color: ${p => p.theme.palette.text.active};
  margin: auto;
  margin-top: 40px;
  text-align: center;
  font-size: 16px;
`)

export const NewStyleGroupContainer = styled.div`
  display: flex;
  margin: 5px;
`

export const NewStyleGroupIcon = styled.i`
  padding: 0 10px 0 0;
`

export const NewStyleGroupButton = connectToMap(styled.div`
  flex: 1;
  margin: 0 5px;
  background: ${p => p.theme.palette.background.paper};
  border-radius: 10px;
  padding: 12px 8px;
  font-size: 15px;
  text-transform: uppercase;
  font-weight: 500;
  text-align: center;
  color: #505050;
  cursor: pointer;
  transition: all 0.15s ease-in-out;

  &:hover {
    background: ${p => p.theme.palette.action.hover};
  }
`)
