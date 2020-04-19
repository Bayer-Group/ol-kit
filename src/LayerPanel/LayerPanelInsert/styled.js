import styled from 'styled-components'
import { withStyles } from '@material-ui/core/styles'
import MaterialCardHeader from '@material-ui/core/CardHeader'
import MaterialCard from '@material-ui/core/Card'

export const NoCatalogLayer = styled.div`
  margin: 15px;
`

export const CardHeader = withStyles(() => ({
  title: {
    fontSize: '18px'
  },
  root: {
    background: '#ededed'
  }
}))(MaterialCardHeader)

export const Card = withStyles(() => ({
  root: {
    margin: '15px',
    wordBreak: 'break-all'
  }
}))(MaterialCard)
