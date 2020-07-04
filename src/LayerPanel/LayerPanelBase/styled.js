import React from 'react'
import MaterialCard from '@material-ui/core/Card'
import MaterialTabs from '@material-ui/core/Tabs'
import MaterialTab from '@material-ui/core/Tab'
import MaterialCheckbox from '@material-ui/core/Checkbox'
import { connectToMap } from 'Map'
import { styled } from '@material-ui/core/styles'

export const Card = connectToMap(({ theme, ...props }) => <StyledCard theme={theme} {...props} />)
const StyledCard = styled(({ theme, ...props }) => <MaterialCard {...props} />)({
  maxHeight: '645px',
  minHeight: props => `${200 + (props.numoftabs * 40)}px`,
  width: '400px',
  top: '100px',
  transition: 'all .3s',
  background: props => props.theme.palette.background.default,
  position: props => props.inline ? 'inline' : 'absolute',
  right: props => props.open ? '0px' : '-400px'
})

export const Tabs = connectToMap(({ theme, ...props }) => <StyledTab theme={theme} orientation='vertical' {...props} />)
export const StyledTab = styled(({ theme, ...props }) =>
  <MaterialTabs orientation='vertical' {...props} />
)({
  width: '50px',
  top: '175px',
  position: 'fixed',
  background: props => props.theme.palette.background.default,
  border: '1px solid rgba(0, 0, 0, 0.1)',
  borderRadius: '5px 0px 0px 5px',
  transition: 'all .3s',
  right: props => props.open ? '400px' : '0px'
})

export const Tab = connectToMap(styled(({ ...props }) => <MaterialTab {...props} />)({
  minWidth: 'inherit'
}))

export const Checkbox = connectToMap(({ ...props }) => <MaterialCheckbox {...props} color='primary' />)
