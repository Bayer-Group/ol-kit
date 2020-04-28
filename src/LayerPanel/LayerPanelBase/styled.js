import React from 'react'
import MaterialCard from '@material-ui/core/Card'
import MaterialTabs from '@material-ui/core/Tabs'
import MaterialTab from '@material-ui/core/Tab'
import MaterialCheckbox from '@material-ui/core/Checkbox'
import { styled } from '@material-ui/styles'

export const Card = styled(({ ...props }) => <MaterialCard {...props} />)({
  maxHeight: '645px',
  minHeight: props => `${200 + (props.numoftabs * 40)}px`,
  width: '400px',
  top: '100px',
  transition: 'all .3s',
  position: props => props.inline ? 'inline' : 'absolute',
  right: props => props.open ? '0px' : '-400px'
})

export const Tabs = styled(({ ...props }) => {
  const backgroundColor = props.open ? '#152357' : '#fff'

  return <MaterialTabs
    TabIndicatorProps={{ style: { backgroundColor } }}
    orientation='vertical' {...props} />
})({
  width: '50px',
  top: '175px',
  position: 'fixed',
  background: 'white',
  border: '1px solid rgba(0, 0, 0, 0.1)',
  borderRadius: '5px 0px 0px 5px',
  transition: 'all .3s',
  right: props => props.open ? '400px' : '0px'
})

export const Tab = styled(({ ...props }) => <MaterialTab {...props} />)({
  minWidth: 'inherit',
  '&.Mui-selected': {
    color: '#152357'
  },
  '&:hover': {
    color: '#152357'
  }
})

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
