import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Tooltip, IconButton } from './styled'
import olDrawInteraction from 'ol/interaction/draw'
import Icon from '@mdi/react'
import { mdiSquareOutline } from '@mdi/js'

const BOX_CONFIG = {
  type: 'Circle',
  geometryFunction: olDrawInteraction.createBox()
}

class Box extends Component {
  isBoxDraw = () => {
    const { type, geometryFunction } = this.props

    return type === 'Circle' && typeof geometryFunction === 'function' && geometryFunction.toString() === BOX_CONFIG.geometryFunction.toString()
  }

  render () {
    const { addInteraction, tooltipTitle } = this.props

    return (
      <Tooltip title={tooltipTitle}>
        <IconButton
          size='small'
          onClick={() => addInteraction(BOX_CONFIG)}>
          <Icon path={mdiSquareOutline} size={1} color={this.isBoxDraw() ? '#1976D2' : '#656565'} />
        </IconButton>
      </Tooltip>
    )
  }
}

Box.propTypes = {
  /** the openlayers draw type */
  type: PropTypes.string,

  /** A function that creates a openlayers draw interaction box */
  geometryFunction: PropTypes.func,

  /** a function that adds the draw interaction to the openlayers map on click of the button */
  addInteraction: PropTypes.func.isRequired,

  /** a title for the tooltip */
  tooltipTitle: PropTypes.string
}

Box.defaultProps = {
  type: 'Circle',
  geometryFunction: olDrawInteraction.createBox()

}

export default Box
