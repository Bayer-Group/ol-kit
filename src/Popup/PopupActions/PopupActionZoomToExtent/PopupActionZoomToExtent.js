import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { PopupActionItem } from 'Popup'
import { connectToContext } from 'Provider'
import { setMapExtent, getExtentForFeatures } from 'Map'

class ActionZoomToExtent extends Component {
  zoom = () => {
    const { feature, map } = this.props

    setMapExtent(map, getExtentForFeatures([feature]))
  }

  render () {
    const { translations } = this.props

    return (
      <PopupActionItem
        title={translations['_ol_kit.PopupActionZoomToExtent.title']}
        onClick={() => this.zoom()} />
    )
  }
}

ActionZoomToExtent.propTypes = {
  feature: PropTypes.object,
  /** olMap */
  map: PropTypes.object,
  translations: PropTypes.shape({
    '_ol_kit.PopupActionZoomToExtent.title': PropTypes.string
  }).isRequired
}

ActionZoomToExtent.defaultProps = {
  translations: {
    '_ol_kit.PopupActionZoomToExtent.title': 'Zoom to Extent'
  }
}

export default connectToContext(ActionZoomToExtent)
