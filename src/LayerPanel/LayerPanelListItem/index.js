import React, { Component } from 'react'
import { ListItem } from './styled'
import PropTypes from 'prop-types'

/**
 * @component
 * @category LayerPanel
 * @since 0.4.0
 */
class LayerPanelListItem extends Component {
  render () {
    const { title, item, children, handleDoubleClick } = this.props

    return (
      <ListItem key={title} onDoubleClick={() => { handleDoubleClick(item) }}>
        {children}
      </ListItem>
    )
  }
}

LayerPanelListItem.propTypes = {
  /** A string for the LayerPanelListItem title */
  title: PropTypes.string,

  /** object that is rendering in the listitem */
  item: PropTypes.object,

  /** If children is passed, replace the title with children (the item still shows & checkbox & ellipses) */
  children: PropTypes.node,

  /** callback that is called when item is doubleClicked */
  handleDoubleClick: PropTypes.func
}

LayerPanelListItem.defaultProps = {
  handleDoubleClick: () => {}
}

export default LayerPanelListItem
