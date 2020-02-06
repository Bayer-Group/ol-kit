import { withStyles } from '@material-ui/core/styles'
import MaterialContainer from '@material-ui/core/Container'
import MaterialFormControl from '@material-ui/core/FormControl'

export const Container = withStyles(() => ({
  root: {
    padding: '0px'
  }
}))(MaterialContainer)

export const UomContainer = withStyles(() => ({
  root: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    padding: '0px'
  }
}))(MaterialContainer)

export const FormControl = withStyles(() => ({
  root: {
    width: '35%'
  }
}))(MaterialFormControl)
