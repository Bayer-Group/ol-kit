import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Tooltip, IconButton } from './styled'
import RadioButtonUncheckedOutlinedIcon from '@material-ui/icons/RadioButtonUncheckedOutlined'

/**
 * @component
 * @category vmc
 */
class Circle extends Component {
  render () {
    const { addInteraction, type, geometryFunction, tooltipTitle } = this.props

    return (
      <Tooltip title={tooltipTitle}>
        <IconButton
          size='small'
          onClick={() => addInteraction({ type: 'Circle' })}>
          <RadioButtonUncheckedOutlinedIcon  size={1} htmlColor={type === 'Circle' && !geometryFunction ? '#1976D2' : '#656565'} />
        </IconButton>
      </Tooltip>
    )
  }
}

Circle.propTypes = {
  /** the openlayers draw type */
  type: PropTypes.string,

  /** A function that creates a openlayers draw interaction box */
  geometryFunction: PropTypes.func,

  /** a function that adds the draw interaction to the openlayers map on click of the button */
  addInteraction: PropTypes.func,

  /** a title for the tooltip */
  tooltipTitle: PropTypes.string
}

export default Circle
