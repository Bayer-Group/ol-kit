import React, { Component } from 'react'
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

export default LayerPanelExpandableList
