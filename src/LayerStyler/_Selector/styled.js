import styled, { keyframes } from 'styled-components'
import Select from 'react-select'

/** @component */
export const Container = styled.div`
  background: ${props => props.background ? props.background : 'white'};
  padding: 26px 12px 11px 12px;
`

/** @component */
export const Header = styled.label`
  color: ${props => props.focus || props.valid || props.disabled ? '#5264AE' : '#8a8a8a'};
  font-size: ${props => props.focus ? '14px' : '0.8em'};
  line-height: 0.8em;
  font-weight: normal;
  position: absolute;
  pointer-events: none;
  left: 5px;
  top: ${props => props.focus || props.valid || props.disabled ? '-20px' : '21px'};
  transition: 0.2s ease all;
  -moz-transition: 0.2s ease all;
  -webkit-transition: 0.2s ease all;
`

/** @component */
export const SubHeader = styled.div`
  font-size: .6em;
  line-height: .6em;
  margin-top: 6px;
  color: #8a8a8a;
`

export const Group = styled.div`
  position: relative;
  margin-bottom: 0px;
  width: 100%;
`

const inputHighlighter = keyframes`
  from { background: #5264AE; }
  to   { width: 0; background: transparent; }
`

export const Highlight = styled.span`
  position: absolute;
  height: 60%;
  width: 100%;
  top: 25%;
  left: 0;
  pointer-events: none;
  opacity: 0.5;
  animation: ${props => props.focus ? `${inputHighlighter} 0.3s ease` : null};
`

export const Bar = styled.span`
  position: relative;
  display: block;
  width: 100%;
  &:before, &:after {
    content: '';
    height: 2px;
    width: ${props => props.focus ? '50%' : '0px'};
    bottom: 1px;
    position: absolute;
    background: #5264AE;
    transition: 0.2s ease all;
    -moz-transition: 0.2s ease all;
    -webkit-transition: 0.2s ease all;
  }
  &:before {
    left: 50%;
  }
  &:after {
    right: 50%;
  }
`

export const TextInput = styled(Select)`
  background: transparent;
  font-size: 1em;
  padding: 10px 0 10px 5px;
  display: block;
  width: 100%;
  border: none;
  border-bottom: 2px solid #e4e4e4;

  & > div:first-of-type {
    background-color: transparent !important;
    font-size: inherit !important;
    border: none !important;
    box-shadow: none !important;
  }

  & > div > * {
    background-color: transparent !important;
    font-size: inherit !important;
    border: none !important;
  }

  & > div > * > * {
    font-size: inherit !important;
    border: none !important;
  }
`
