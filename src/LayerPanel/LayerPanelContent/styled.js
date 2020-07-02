import React from 'react'
import { styled } from '@material-ui/core/styles'
import MaterialCardContent from '@material-ui/core/CardContent'
import { connectToMap } from 'Map'

export const CardContent = connectToMap(styled(({ ...props }) => <MaterialCardContent {...props} />)({
  maxHeight: '565px',
  overflow: 'hidden',
  padding: props => props.padding ? props.padding : '10px 15px',
  marginBottom: '5px'
}))
