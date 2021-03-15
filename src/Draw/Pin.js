import React from 'react'
import PropTypes from 'prop-types'
import { Tooltip, IconButton } from './styled'
import PinDrop from '@material-ui/icons/PinDrop'

/**
 * A button for drawing points.
 * @component
 * @category Draw
 * @since 0.18.0
 */
function DrawPin (props) {
  const { addInteraction, type, tooltipTitle } = props

  return (
    <Tooltip title={tooltipTitle}>
      <IconButton
        data-testid='Draw.pin'
        size='small'
        onClick={() => addInteraction({ type })}>
        <PinDrop fontSize={'small'} size={0.5} htmlColor={type === 'Point' ? '#1976D2' : '#656565'} />
      </IconButton>
    </Tooltip>
  )
}

DrawPin.propTypes = {
  /** the openlayers draw type */
  type: PropTypes.string,

  /** a function that adds the draw interaction to the openlayers map on click of the button */
  addInteraction: PropTypes.func.isRequired,

  /** a title for the tooltip */
  tooltipTitle: PropTypes.string
}

export default DrawPin
