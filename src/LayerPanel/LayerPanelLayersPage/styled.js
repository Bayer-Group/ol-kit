import React from 'react'
import { styled } from '@material-ui/styles'
import MaterialListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'

export const ListItemSecondaryAction = styled(({ ...props }) => <MaterialListItemSecondaryAction {...props} />)({
  right: '0px'
})
