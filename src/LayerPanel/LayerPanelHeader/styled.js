import React from 'react'
import styled from 'styled-components'
import { withStyles } from '@material-ui/core/styles'
import MaterialCardHeader from '@material-ui/core/CardHeader'
import { connectToMap } from 'Map'
import {  } from '@material-ui/styles'

export const HeaderContainer = styled.div`
  height: 50px;
`

export const CardHeader = connectToMap(({ theme, ...props }) => <StyledCardHeader theme={theme} {...props} />)
const StyledCardHeader = withStyles({
  title: {
    fontSize: '20px',
    fontWeight: '500'
  },
  root: {
    background: props => props.theme.palette.divider,
    height: '50px'
  }
})(MaterialCardHeader)

export const ActionsContainer = styled.div`
  margin-top: 4px;
  display: flex;
`
