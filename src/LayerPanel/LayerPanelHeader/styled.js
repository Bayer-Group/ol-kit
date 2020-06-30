import styled from 'styled-components'
import { withStyles } from '@material-ui/core/styles'
import MaterialCardHeader from '@material-ui/core/CardHeader'
import { connectToMap } from 'Map'

export const HeaderContainer = styled.div`
  height: 50px;
`

export const CardHeader = withStyles(() => ({
  title: {
    fontSize: '20px',
    fontWeight: '500'
  },
  root: {
    height: '50px'
  }
}))(connectToMap(MaterialCardHeader))

export const ActionsContainer = styled.div`
  margin-top: 4px;
  display: flex;
`
