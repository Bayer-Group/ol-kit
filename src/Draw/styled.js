import { withStyles } from '@material-ui/core/styles'
import MaterialIconButton from '@material-ui/core/IconButton'
import MaterialContainer from '@material-ui/core/Container'
import MaterialTooltip from '@material-ui/core/Tooltip'

export const Container = withStyles({
  root: {
    padding: '15px 0px',
    maxWidth: '100%'
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
