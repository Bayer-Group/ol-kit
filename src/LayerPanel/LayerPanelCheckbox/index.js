import React, { Component } from 'react'
import { Checkbox } from './styled'

import Icon from '@mdi/react'
import { mdiCheckboxBlank } from '@mdi/js'

class LayerPanelCheckbox extends Component {
  render () {
    const { checkboxState, handleClick, color } = this.props

    if (checkboxState === 'indeterminate') {
      return (
        <Checkbox indeterminateIcon={<Icon path={mdiCheckboxBlank} size={1} color={color} />}
          onClick={(e) => handleClick(false, e)} checked={checkboxState} indeterminate />
      )
    } else {
      return (
        <Checkbox onClick={(e) => handleClick(e, !checkboxState)} checked={checkboxState} />
      )
    }
  }
}

LayerPanelCheckbox.defaultProps = {
  color: '#152357'
}

export default LayerPanelCheckbox
