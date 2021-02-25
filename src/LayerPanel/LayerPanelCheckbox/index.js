import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Checkbox } from './styled'

import Icon from '@mdi/react'
import { mdiCheckboxBlank } from '@mdi/js'

/**
 * @component
 * @category LayerPanel
 * @since 0.5.0
 */
class LayerPanelCheckbox extends Component {
  render () {
    const { checkboxState, handleClick, color } = this.props
    const checkboxDataTestId = checkboxState ? 'LayerPanel.checked' : 'LayerPanel.unchecked'

    if (checkboxState === 'indeterminate') {
      return (
        <Checkbox inputProps={{
          'data-testid': 'LayerPanel.indeterminateCheckbox'
        }} indeterminateIcon={<Icon path={mdiCheckboxBlank} size={1} color={color} />}
        onClick={(e) => handleClick(e, true)} checked={!!checkboxState} indeterminate />
      )
    } else {
      return (
        <Checkbox inputProps={{
          'data-testid': checkboxDataTestId
        }} onClick={(e) => handleClick(e, !checkboxState)} checked={checkboxState} />
      )
    }
  }
}

LayerPanelCheckbox.propTypes = {
  /** checkbox checked state, either string('indeterminate') or bool */
  checkboxState: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool
  ]),
  /** function that handles the click of checkbox. Returns the event and the state of the checkbox (bool) */
  handleClick: PropTypes.func.isRequired,
  /** string for checkbox checked color (hex) */
  color: PropTypes.string
}

LayerPanelCheckbox.defaultProps = {
  color: '#152357'
}

export default LayerPanelCheckbox
