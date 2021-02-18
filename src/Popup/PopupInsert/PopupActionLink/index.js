import React from 'react'
import PropTypes from 'prop-types'

import { PopupActionItem } from 'Popup'

const PopupActionLink = ({ href, target, windowFeatures, ...props }) => {

    const onClick = async (event, feature) => {
        window.open(href, target, windowFeatures)
        return props.onClick(event, feature)
    }

    return <PopupActionItem onClick={onClick} {...props} />
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
    target: PropTypes.oneOf([
        '_blank', '_self', '_parent', '_top'
    ])
  }
  
  PopupActionItem.defaultProps = {
    onClick: () => {},
    target: "_blank"
  }

export default PopupActionLink