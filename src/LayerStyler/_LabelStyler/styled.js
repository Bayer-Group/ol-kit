import styled from 'styled-components'
import MaterialSwitch from '@material-ui/core/Switch'
import { withStyles } from '@material-ui/styles'


export const TopControls = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 15px;
  padding: 15px;
  box-shadow: 0px 2px 28px rgba(0,0,0,0.04), 0px 5px 10px rgba(0,0,0,0.1);
  border-radius: 5px;
`


export const ToggleContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  font-weight: 500;
  color: #6f6f6f;
`


export const SymbolizerContainer = styled.div`
  width: 290px;
  display: flex;
`

export const Title = styled.div`
  font-size: 10px;
  /* text-transform: uppercase; */
  color: ${props => props.color ? props.color : '#ccc'};
  text-align: center;
`


export const Button = styled.div`
  user-select: none;
  display: inline-block;
  cursor: pointer;
  width: 25%;
  font-size: 12px;
`


export const ButtonText = styled.span`
  color: #152357;

  &:hover {
    color: #0053a5;
  }
`


export const AttributeHeader = styled.div`
  display: flex;
  margin: 0 20px;
  justify-content: space-between;
  text-align: right;
  font-weight: 500;
  color: #6f6f6f;
  line-height: 32px;
`


export const AttributeContainer = styled.div`
  margin: 10px;
  display: flex;
  flex-wrap: wrap;
`


export const AttributeItem = styled.div`
  padding: 5px 10px;
  color: ${props => props.checked ? '#fff' : '#000'};
  background: ${props => props.checked ? '#979797' : '#f5f5f5'};
  margin: 5px;
  border-radius: 30px;

  &:hover {
    cursor: pointer;
    color: #000000;
    background: ${props => props.checked ? '#979797' : '#f5f5f5'};
  }
`


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

export const Switch = withStyles(() => ({
  switchBase: {
    color: '#152457',
    '&$checked': {
      color: '#152457'
    },
    '&$checked + $track': {
      backgroundColor: '#152457'
    }
  },
  checked: {},
  track: {}
}))(MaterialSwitch)
