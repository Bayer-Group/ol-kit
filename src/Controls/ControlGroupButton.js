import React from 'react'
import PropTypes from 'prop-types'

import IconButton from '@material-ui/core/IconButton'
import { connectToContext } from 'Provider'

import { IconWrapper } from './styled'

/**
 * A control group button wrapper using a Material IconButton
 * @component
 * @category Controls
 * @since 0.14.0
 */
function ControlGroupButton (props) {
  return (
    <IconWrapper>
      <IconButton {...props} style={{ padding: '3px' }}>
        {props.icon || props.children}
      </IconButton>
    </IconWrapper>
  )
}

ControlGroupButton.propTypes = {
  /** Pass an icon to display as either the icon prop or as a child */
  icon: PropTypes.node,
  /** Pass an icon to display as either the icon prop or as a child */
  children: PropTypes.node
}

export default connectToContext(ControlGroupButton)
