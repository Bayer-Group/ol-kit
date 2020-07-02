import React from 'react'
import styled from 'styled-components'
import { withStyles } from '@material-ui/core/styles'
import MaterialTypography from '@material-ui/core/Typography'
import MateriaSlider from '@material-ui/core/Slider'
import { connectToMap } from 'Map'

export const OpacityTitle = connectToMap(({ theme, ...props }) => <StyledOpacityTitle theme={theme} {...props} />)
const StyledOpacityTitle = withStyles({
  root: {
    fontSize: '12px',
    paddingTop: '0.3rem',
    color: props => props.theme.palette.background.default
  }
})(MaterialTypography)

export const Slider = withStyles(() => ({
  root: {
    padding: '0'
  }
}))(connectToMap(MateriaSlider))

export const OpacityWrapper = styled.div`
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
`
