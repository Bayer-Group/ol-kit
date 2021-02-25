import React from 'react'
import MaterialCard from '@material-ui/core/Card'
import MaterialTabs from '@material-ui/core/Tabs'
import MaterialTab from '@material-ui/core/Tab'
import MaterialCheckbox from '@material-ui/core/Checkbox'
import MaterialCardContent from '@material-ui/core/CardContent'
import { styled } from '@material-ui/styles'

export const Card = styled(({ ...props }) => <MaterialCard {...props} />)({
  maxHeight: '645px',
  minHeight: props => `${200 + (props.numoftabs * 40)}px`,
  width: '400px',
  top: '80px',
  transition: 'all .3s',
  position: props => props.inline ? 'inline' : 'absolute',
  right: props => props.open ? '15px' : '-400px',
  opacity: 0.9,
  overflow: 'scroll'
})

export const Tabs = styled(({ ...props }) => {
  const backgroundColor = props.open ? '#152357' : '#fff'

  return <MaterialTabs
    TabIndicatorProps={{ style: { backgroundColor } }} {...props} />
})({
  background: '#ededed',
  transition: 'all .3s',
  borderBottom: '1px solid lightgrey'
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
  },
  top: '80px',
  background: 'white',
  border: '1px solid rgba(0, 0, 0, 0.1)',
  borderRadius: '4px',
  position: 'absolute',
  right: '15px',
  opacity: 1
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

export const CardContent = styled(({ ...props }) => <MaterialCardContent {...props} />) ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0px 0px 0px 16px',
  background: '#ededed'
})
