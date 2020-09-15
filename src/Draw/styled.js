import styled from 'styled-components'
import { withStyles } from '@material-ui/core/styles'
import MaterialIconButton from '@material-ui/core/IconButton'
import MaterialContainer from '@material-ui/core/Container'
import MaterialTooltip from '@material-ui/core/Tooltip'

export const Container = styled.div`
  padding: 15px;
  width: min-content;
  background-color: white;
  left: 0px;
  top: 0px;
  position: absolute;
  border-radius: 5px;
`


export const ButtonContainer = withStyles({
  root: {
    display: 'flex',
    flexWrap: 'nowrap',
    justifyContent: 'space-evenly',
    margin: '10px'
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

/** @component */
export const ProgressWrapper = styled.div`
  display: flex;
  height: 100px;
  justify-content: center;
  align-items: center;
`
