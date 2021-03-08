import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { PopupActionItem } from 'Popup'
import { connectToContext } from 'Provider'

class ActionRemove extends Component {
  remove = () => {
    const { feature, parentLayerKey, onRemoveFeature } = this.props

    feature.get(parentLayerKey).getSource().removeFeature(feature)
    onRemoveFeature(feature)
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
  onRemoveFeature: PropTypes.func,
  /** A String for the feature to find its parent layer to remove from */
  parentLayerKey: PropTypes.string,
  /** Object with key/value pairs for translated strings */
  translations: PropTypes.shape({
    '_ol_kit.PopupActionRemove.title': PropTypes.string
  }).isRequired
}

ActionRemove.defaultProps = {
  onRemoveFeature: () => {},
  parentLayerKey: '_ol_kit_parent',
  translations: {
    '_ol_kit.PopupActionRemove.title': 'Remove Feature'
  }
}

export default connectToContext(ActionRemove)
