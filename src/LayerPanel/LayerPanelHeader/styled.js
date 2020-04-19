import styled from 'styled-components'
import { withStyles } from '@material-ui/core/styles'
import MaterialCardHeader from '@material-ui/core/CardHeader'

export const HeaderContainer = styled.div`
  height: 75px;
`

export const CardHeader = withStyles(() => ({
  title: {
    fontSize: '20px',
    fontWeight: '500'
  },
  root: {
    background: '#ededed',
    height: '75px'
  }
}))(MaterialCardHeader)
