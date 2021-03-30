import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { PopupActionItem } from 'Popup'
import { connectToContext } from 'Provider'

class ActionRemove extends Component {
  remove = () => {
    const { feature, parentLayerKey, onActionEnd, onClose } = this.props

    if (typeof onActionEnd === 'function') {
      onActionEnd(feature)
    } else {
      feature.get(parentLayerKey).getSource().removeFeature(feature)
      onClose()
    }
  }

  render () {
    const { translations } = this.props

    return (
      <PopupActionItem
        title={translations['_ol_kit.PopupActionRemove.title']}
        onClick={() => this.remove()}
        style={{ color: '#c0392b' }} />
    )
  }
}

ActionRemove.propTypes = {
  feature: PropTypes.object,
  /** Called with removed feature */
  onActionEnd: PropTypes.func,
  /** A String for the feature to find its parent layer to remove from */
  parentLayerKey: PropTypes.string,
  /** Callback to close Popup */
  onClose: PropTypes.func,
  /** Object with key/value pairs for translated strings */
  translations: PropTypes.shape({
    '_ol_kit.PopupActionRemove.title': PropTypes.string
  }).isRequired
}

ActionRemove.defaultProps = {
  parentLayerKey: '_ol_kit_parent',
  translations: {
    '_ol_kit.PopupActionRemove.title': 'Remove Feature'
  }
}

export default connectToContext(ActionRemove)
