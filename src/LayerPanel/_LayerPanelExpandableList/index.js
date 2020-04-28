import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ExpandLess from '@material-ui/icons/ExpandMore'
import ExpandMore from '@material-ui/icons/ChevronRight'

class LayerPanelExpandableList extends Component {
  render () {
    const { show, open, handleClick } = this.props

    if (show) {
      if (open) {
        return <ExpandLess data-testid='LayerPanel.expandLayer' onClick={handleClick} />
      } else {
        return <ExpandMore data-testid='LayerPanel.expandLayer' onClick={handleClick} />
      }
    } else {
      return null
    }
  }
}

LayerPanelExpandableList.propTypes = {
  show: PropTypes.bool,
  open: PropTypes.bool,
  handleClick: PropTypes.func.isRequired
}

export default LayerPanelExpandableList
