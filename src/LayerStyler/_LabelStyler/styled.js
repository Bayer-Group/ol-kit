import React from 'react'
import styled from 'styled-components'
import MaterialSwitch from '@material-ui/core/Switch'
import { withStyles } from '@material-ui/styles'
import { connectToMap } from 'Map'


export const TopControls = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 15px;
  padding: 15px;
  box-shadow: 0px 2px 28px rgba(0,0,0,0.04), 0px 5px 10px rgba(0,0,0,0.1);
  border-radius: 5px;
`


export const ToggleContainer = connectToMap(styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  font-weight: 500;
  color: ${p => p.theme.palette.text.secondary};
`)


export const SymbolizerContainer = styled.div`
  width: 290px;
  display: flex;
`

export const Title = connectToMap(styled.div`
  font-size: 10px;
  /* text-transform: uppercase; */
  color: ${props => props.color ? props.color : props.theme.palette.text.primary};
  text-align: center;
`)


export const Button = styled.div`
  user-select: none;
  display: inline-block;
  cursor: pointer;
  width: 25%;
  font-size: 12px;
`


export const ButtonText = connectToMap(styled.span`
  color: ${p => p.theme.palette.secondary.main};

  &:hover {
    color: ${p => p.theme.palette.secondary.dark};
  }
`)


export const AttributeHeader = connectToMap(styled.div`
  display: flex;
  margin: 0 20px;
  justify-content: space-between;
  text-align: right;
  font-weight: 500;
  color: ${p => p.theme.palette.text.primary};
  line-height: 32px;
`)


export const AttributeContainer = styled.div`
  margin: 10px;
  display: flex;
  flex-wrap: wrap;
`


export const AttributeItem = connectToMap(styled.div`
  padding: 5px 10px;
  color: ${p => p.theme.palette.text.secondary};
  background: ${props => props.checked ? props.theme.palette.primary.main : props.theme.palette.background.paper};
  margin: 5px;
  border-radius: 30px;

  &:hover {
    cursor: pointer;
    color: ${p => p.theme.palette.text.primary};
    background: ${props => props.checked ? props.theme.palette.action.selected : props.theme.palette.action.hover};
  }
`)


export const Color = styled.div`
  width: 30%;
`


export const Outline = styled.div`
  width: 30%;
`


export const Size = styled.div`
  width: 40%;
`


export const Unit = styled.div`
  width: 30%;
`

export const Switch = connectToMap(({ theme, ...props }) => <StyledSwitch theme={theme} {...props} />)
const StyledSwitch = withStyles({
  switchBase: {
    color: props => props.theme.palette.divider,
    '&$checked': {
      color: props => props.theme.palette.secondary.main
    },
    '&$checked + $track': {
      backgroundColor: props => props.theme.palette.secondary.main
    }
  },
  checked: {},
  track: {}
})(MaterialSwitch)
