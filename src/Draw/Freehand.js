import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Tooltip, IconButton } from './styled'
import GestureOutlinedIcon from '@material-ui/icons/GestureOutlined'

/**
 * A button for drawing freehand line strings.
 * @component
 * @category Draw
 * @since 0.18.0
 */
class DrawFreehand extends Component {
  render () {
    const { addInteraction, type, freehand, tooltipTitle } = this.props

    return (
      <Tooltip title={tooltipTitle}>
        <IconButton
          data-testid='Draw.freehand'
          size='small'
          onClick={() => addInteraction({ type: 'LineString', freehand: true })}>
          <GestureOutlinedIcon size={1} htmlColor={type === 'LineString' && freehand ? '#1976D2' : '#656565'} />
        </IconButton>
      </Tooltip>
    )
  }
}

DrawFreehand.propTypes = {
  /** the openlayers draw type */
  type: PropTypes.string,

  /** a function that adds the draw interaction to the openlayers map on click of the button */
  addInteraction: PropTypes.func,

  /** A boolean to check if the button is freehand */
  freehand: PropTypes.bool,

  /** a title for the tooltip */
  tooltipTitle: PropTypes.string
}

export default DrawFreehand
