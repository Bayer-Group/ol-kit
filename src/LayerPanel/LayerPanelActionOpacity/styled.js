import styled from 'styled-components'
import { withStyles } from '@material-ui/core/styles'
import MaterialTypography from '@material-ui/core/Typography'
import MateriaSlider from '@material-ui/core/Slider'

export const OpacityTitle = withStyles(() => ({
  root: {
    fontSize: '12px',
    paddingTop: '0.3rem'
  }
}))(MaterialTypography)

export const Slider = withStyles(() => ({
  root: {
    padding: '0'
  }
}))(MateriaSlider)

export const OpacityWrapper = styled.div`
  width: auto;
  flex-direction: column;
  align-items: flex-start;
  padding: 5px 15px;
`
