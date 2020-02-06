import { withStyles } from '@material-ui/core/styles'
import MaterialIconButton from '@material-ui/core/IconButton'
import MaterialContainer from '@material-ui/core/Container'
import MaterialTooltip from '@material-ui/core/Tooltip'
import Button from '@material-ui/core/Button'

export const Container = withStyles({
  root: {
    padding: '15px 0px'
  }
})(MaterialContainer)

export const ButtonContainer = withStyles({
  root: {
    display: 'flex',
    flexWrap: 'nowrap',
    justifyContent: 'space-evenly'
  }
})(MaterialContainer)

export const IconButton = withStyles({
  root: {
    width: '37px',
    height: '37px'
  }
})(MaterialIconButton)

export const Tooltip = withStyles({
  tooltip: {
    fontSize: '15px'
  }
})(MaterialTooltip)

export const StyledButton = withStyles(() => ({
  root: {
    marginRight: '10px'
  }
}))(Button)
