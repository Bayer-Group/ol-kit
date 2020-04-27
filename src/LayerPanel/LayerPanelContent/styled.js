import { withStyles } from '@material-ui/core/styles'
import MaterialCardContent from '@material-ui/core/CardContent'

export const CardContent = withStyles(() => ({
  root: {
    maxHeight: '565px',
    overflow: 'scroll',
    padding: '0px 15px',
    marginBottom: '5px'
  }
}))(MaterialCardContent)
