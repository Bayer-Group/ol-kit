import React from 'react'
import MaterialCard from '@material-ui/core/Card'
import MaterialTabs from '@material-ui/core/Tabs'
import MaterialTab from '@material-ui/core/Tab'
import MaterialCheckbox from '@material-ui/core/Checkbox'
import MaterialCardContent from '@material-ui/core/CardContent'
import { styled } from '@material-ui/styles'

export const Card = styled(({ ...props }) => <MaterialCard {...props} />)({
  height: props => props.open ? `auto` : '48px',
  position: 'absolute',
  maxHeight: '645px',
  width: '400px',
  top: '20px',
  left: '15px',
  transition: 'all .3s',
  opacity: 0.9,
  '&:hover': {
    opacity: '1'
  }
})

export const Tabs = styled(({ ...props }) => {
  const backgroundColor = '#152357'

  return <MaterialTabs
    TabIndicatorProps={{ style: { backgroundColor } }} {...props} />
})({
  background: '#ededed',
  transition: 'all .3s'
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

export const InitialTab = styled(({ ...props }) => <MaterialTab {...props} />)({
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

export const CardContent = styled(({ ...props }) => <MaterialCardContent {...props} />)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0px 0px 0px 16px',
  background: '#ededed'
})
