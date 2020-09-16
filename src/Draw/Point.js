import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Tooltip, IconButton } from './styled'
import LensIcon from '@material-ui/icons/Lens'

/**
 * A button for drawing points.
 * @component
 * @category Draw
 * @since 0.18.0
 */
class Point extends Component {
  render () {
    const { addInteraction, type, tooltipTitle } = this.props

    return (
      <Tooltip title={tooltipTitle}>
        <IconButton
          data-testid='Draw.point'
          size='small'
          onClick={() => addInteraction({ type: 'Point' })}>
          <LensIcon fontSize={'small'} size={0.5} htmlColor={type === 'Point' ? '#1976D2' : '#656565'} />
        </IconButton>
      </Tooltip>
    )
  }
}

Point.propTypes = {
  /** the openlayers draw type */
  type: PropTypes.string,

  /** a function that adds the draw interaction to the openlayers map on click of the button */
  addInteraction: PropTypes.func,

  /** a title for the tooltip */
  tooltipTitle: PropTypes.string
}

export default Point
