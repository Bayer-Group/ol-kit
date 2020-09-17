import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Tooltip, IconButton } from './styled'
import ChangeHistoryOutlinedIcon from '@material-ui/icons/ChangeHistoryOutlined'

/**
 * A button for drawing polygons.
 * @component
 * @category Draw
 * @since 0.18.0
 */
class DrawPolygon extends Component {
  render () {
    const { addInteraction, type, tooltipTitle } = this.props

    return (
      <Tooltip title={tooltipTitle}>
        <IconButton
          data-testid='Draw.polygon'
          size='small'
          onClick={() => addInteraction({ type: 'Polygon' })}>
          <ChangeHistoryOutlinedIcon size={1} htmlColor={type === 'Polygon' ? '#1976D2' : '#656565'} />
        </IconButton>
      </Tooltip>
    )
  }
}

DrawPolygon.propTypes = {
  /** the openlayers draw type */
  type: PropTypes.string,

  /** a function that adds the draw interaction to the openlayers map on click of the button */
  addInteraction: PropTypes.func,

  /** a title for the tooltip */
  tooltipTitle: PropTypes.string
}

export default DrawPolygon
