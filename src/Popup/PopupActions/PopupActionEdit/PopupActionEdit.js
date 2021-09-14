import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { PopupActionItem } from 'Popup'
import { FeatureEditor } from 'FeatureEditor'
import { connectToContext } from 'Provider'

import olStyleStyle from 'ol/style/Style'

class PopupActionEdit extends Component {
  constructor (props) {
    super(props)

    this.state = {
      showFeatureEditor: false,
      style: undefined
    }
  }

  componentWillUnmount () {
    this.onEditCancel([this.props.feature])
  }

  componentDidMount () {
    const { feature } = this.props
    const style = feature.getStyle() // grab the original feature's style

    this.setState({ style }) // save that style to state
  }

  onEditEnd = (features) => {
    const geom = features[0].getGeometry()
    const { feature, onEditFinish, persistState, persistedStateKey, onEdit } = this.props
    const { style } = this.state

    onEdit({ active: false })

    if (!feature) return

    feature.setGeometry(geom)

    feature.setStyle(style || null) // restore the original feature's style
    onEditFinish && onEditFinish(features)
    this.setState({ showFeatureEditor: false })
  }

  onEditCancel = (features) => {
    const { feature, onEditCancel, persistedStateKey, persistStat, onEdit } = this.props
    const { style } = this.state

    onEdit({ active: false })

    feature.setStyle(style || null) // restore the original feature's style
    onEditCancel && onEditCancel(features)
    // persistState({ isEditActive: false }, persistedStateKey)
    this.setState({ showFeatureEditor: false })
  }

  onEditStart = (opts) => {
    const { persistState, persistedStateKey, onEdit } = this.props
    const { feature, showPopup, onEditBegin } = this.props

    onEdit({ active: true })

    const style = feature.getStyle() // grab the original feature's style

    this.setState({ style }) // save that style to state
    showPopup && showPopup(false)
    onEditBegin && onEditBegin(opts)
    feature.setStyle(new olStyleStyle({}))
  }

  render () {
    const { translations, feature, map } = this.props
    const { showFeatureEditor, areaUOM, distanceUOM } = this.state

    return (
      <div>
        <PopupActionItem title={translations['popup.editGeom'] || 'Edit Geometry'} onClick={() => this.setState({ showFeatureEditor: true })} />
        {showFeatureEditor && (
          <FeatureEditor
            map={map}
            editOpts={{ features: [feature] }}
            onEditFinish={this.onEditEnd}
            onEditBegin={this.onEditStart}
            onEditCancel={this.onEditCancel}
            areaUOM={areaUOM}
            distanceUOM={distanceUOM} />
        )}
      </div>
    )
  }
}

PopupActionEdit.propTypes = {
  translations: PropTypes.object,
  feature: PropTypes.object,
  map: PropTypes.object,
  onEditFinish: PropTypes.func,
  onEditCancel: PropTypes.func,
  onEditBegin: PropTypes.func,
  showPopup: PropTypes.func,
  areaUOM: PropTypes.string,
  distanceUOM: PropTypes.string,
  persistedState: PropTypes.object,
  persistedStateKey: PropTypes.string,
  persistState: PropTypes.func,
  onEdit: PropTypes.func
}

PopupActionEdit.defaultProps = {
  showPopup: () => false,
  onEdit: () => false,
  persistedStateKey: 'GeokitPopup',
  translations: {
    'popup.editGeom': 'Edit Geometry'
  }
}

export default connectToContext(PopupActionEdit)
