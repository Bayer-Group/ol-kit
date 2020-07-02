import React from 'react'
import PropTypes from 'prop-types'

import { ListItem } from './styled'

class ContextMenuListItem extends React.PureComponent {
  render () {
    const { title, disabled, onClick } = this.props

    return (
      <ListItem disabled={disabled} onClick={e => !disabled ? onClick(e) : null}>
        {title}
      </ListItem>
    )
  }
}

ContextMenuListItem.propTypes = {
  /** Title text which is shown for the list item */
  title: PropTypes.string.isRequired,

  /** A callback function when the menu item is clicked */
  onClick: PropTypes.func.isRequired,

  /** Indicates if the context menu item is clickable */
  disabled: PropTypes.bool.isRequired
}

ContextMenuListItem.defaultProps = {
  disabled: false
}

export default ContextMenuListItem
