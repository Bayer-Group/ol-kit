import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Tooltip, IconButton } from '../Draw/styled'

import Icon from '@mdi/react'
import { mdiPentagonOutline } from '@mdi/js'

class Polygon extends Component {
  render () {
    const { addInteraction, type, tooltipTitle } = this.props

    return (
      <Tooltip title={tooltipTitle}>
        <IconButton
          size='small'
          onClick={() => addInteraction({ type: 'Polygon' })}>
          <Icon path={mdiPentagonOutline} size={1} color={type === 'Polygon' ? '#1976D2' : '#656565'} />
        </IconButton>
      </Tooltip>
    )
  }
}

Polygon.propTypes = {
  /** the openlayers draw type */
  type: PropTypes.string,

  /** a function that adds the draw interaction to the openlayers map on click of the button */
  addInteraction: PropTypes.func,

  /** a title for the tooltip */
  tooltipTitle: PropTypes.string
}

export default Polygon
