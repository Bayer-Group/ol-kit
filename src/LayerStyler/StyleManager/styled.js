import styled from 'styled-components'
import MaterialTooltip from '@material-ui/core/Tooltip'
import { withStyles } from '@material-ui/core'

export const HeaderContainer = styled.div`
  padding-top: 15px;
  background: #eeeeee;
`

export const InputContainer = styled.div`
  display: inline-block;
  width: 75%;
`

export const FilterContainer = styled.div`
  display: inline-block;
  padding: 36px 0;
  text-align: center;
  vertical-align: top;
`

export const Tooltip = withStyles(() => ({
  tooltip: {
    fontSize: '15px',
    paddingTop: '-36px'
  }
}))(MaterialTooltip)
