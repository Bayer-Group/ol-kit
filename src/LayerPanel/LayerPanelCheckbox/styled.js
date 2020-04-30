import React from 'react'
import MaterialCheckbox from '@material-ui/core/Checkbox'
import { styled } from '@material-ui/styles'

export const Checkbox = styled(({ ...props }) => <MaterialCheckbox {...props} />)({
  '&.MuiCheckbox-colorSecondary.Mui-checked': {
    color: '#152357',
    padding: '9px',
    '&:hover': {
      backgroundColor: 'rgba(1, 8, 90, 0.08)'
    }
  },
  '&.MuiIconButton-colorSecondary': {
    color: '#152357',
    padding: '9px',
    '&:hover': {
      backgroundColor: 'rgba(1, 8, 90, 0.08)'
    }
  }
})
