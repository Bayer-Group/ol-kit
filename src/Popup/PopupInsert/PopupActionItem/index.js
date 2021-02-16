import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Item, Link, Action } from './styled'

/**
 * @component
 * @category Popup
 * @example ./example.md
 */
class PopupActionItem extends Component {
  render () {
    const { children, feature, title, disabled, onClick, style, href, target } = this.props

    if (href && !disabled) {
      return (
        <Action role='button' onClick={(e) => onClick(e, feature)}>
          {title ? <Link href={href} target={target || '_blank'}><span><Item style={style}>{title}</Item></span></Link> : children}
        </Action>
      )
    }

    return (
      <Action role='button' onClick={disabled ? () => {} : (e) => onClick(e, feature)}>
        {title ? <Item disabled={disabled} style={style}>{title}</Item> : children}
      </Action>
    )
  }
}

PopupActionItem.propTypes = {
  /** The title of the action item (if a custom child component is not specified) */
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,

  /** The content of the action item (takes precendence over `title`) */
  children: PropTypes.node,

  /** Determines if the action item should be disabled */
  disabled: PropTypes.bool,

  /** Callback fired when the action item is clicked */
  onClick: PropTypes.func,

  /** Styles applied to <Item> */
  style: PropTypes.object,
  
  /** OpenLayers feature on which the action is being done */
  feature: PropTypes.object,

  /** Link to open when action item is clicked */
  href: PropTypes.string,

  /** Determines how link should be open - _blank means new tab */
  target: PropTypes.string
}

PopupActionItem.defaultProps = {
  disabled: false,
  style: {}
}

export default PopupActionItem
