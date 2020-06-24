import React from 'react'
import { styled } from '@material-ui/styles'
import MaterialPaper from '@material-ui/core/Paper'
import MaterialIconButton from '@material-ui/core/IconButton'
import styledComps from 'styled-components'
import MaterialAlert from '@material-ui/lab/Alert'

export const Paper = styled(({ ...props }) => <MaterialPaper {...props} />)({
  position: 'absolute',
  top: '15px',
  left: '15px',
  fontSize: '17px',
  padding: '2px 4px',
  display: 'flex',
  alignItems: 'center',
  width: 400
})

export const IconButton = styled(({ ...props }) => <MaterialIconButton {...props} />)({
  padding: 10
})

export const Input = styled(({ ...props }) => <input {...props} />)({
  marginLeft: '10px',
  flex: 1,
  fontSize: '17px',
  border: '0px',
  '&:focus': {
    outline: 'none',
    backgroundColor: 'white !important',
    fontSize: '17px'
  },
  '&:-internal-autofill-selected': {
    backgroundColor: 'white !important',
    fontSize: '17px'
  }
})

export const Alert = styled(({ ...props }) => <MaterialAlert {...props} />)({
  position: 'absolute',
  top: '65px',
  left: '15px'
})

export const SearchBarContainer = styledComps.div`
  width: 90%;
  maxWidth: 500px;
  position: absolute;
  left: 15px;
  top: 15px;
  outline: none;
`
