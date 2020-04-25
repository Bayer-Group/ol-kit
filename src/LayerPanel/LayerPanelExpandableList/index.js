import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ExpandLess from '@material-ui/icons/ExpandMore'
import ExpandMore from '@material-ui/icons/ChevronRight'

class LayerPanelExpandableList extends Component {
  render () {
    const { show, open, handleClick } = this.props

    if (show) {
      if (open) {
        return <ExpandLess onClick={handleClick} />
      } else {
        return <ExpandMore onClick={handleClick} />
      }
    } else {
      return null
    }
  }
}

LayerPanelExpandableList.propTypes = {
  /** boolean for show/hide of icon */
  show: PropTypes.bool,
  /** boolean to expand/collapse list */
  open: PropTypes.bool,
  /** callback function for onClick */
  handleClick: PropTypes.func
}

export default LayerPanelExpandableList
