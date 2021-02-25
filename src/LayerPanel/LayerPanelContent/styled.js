import React from 'react'
import { styled } from '@material-ui/core/styles'
import MaterialCardContent from '@material-ui/core/CardContent'

export const CardContent = styled(({ ...props }) => <MaterialCardContent {...props} />)({
  maxHeight: '565px',
  overflow: 'scroll',
  padding: props => props.padding ? props.padding : '10px 15px',
  marginBottom: '5px'
})
