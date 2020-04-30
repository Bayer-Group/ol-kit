import styled from 'styled-components'
import { withStyles } from '@material-ui/core/styles'
import MaterialTooltip from '@material-ui/core/Tooltip'

export const ActionsContainer = styled.div`
  margin-top: 4px;
  display: flex;
`

export const UploadLabel = styled.label`
  cursor: pointer;
  margin: 0 5px;
  color: rgba(0, 0, 0, 0.54);
  border: none;
  background: none;
  fontSize: 20px;
`

export const UploadInput = styled.input`
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: none;
  position: absolute;
`

export const Tooltip = withStyles(() => ({
  tooltip: {
    fontSize: '15px'
  }
}))(MaterialTooltip)
