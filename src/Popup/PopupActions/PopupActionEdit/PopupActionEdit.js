import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { PopupActionItem } from 'Popup'
import { connectToContext } from 'Provider'

class PopupActionEdit extends Component {
  constructor (props) {
    super(props)

    this.state = {
      showFeatureEditor: false,
      style: undefined
    }
  }

  componentDidMount () {
    const { feature } = this.props
    const style = feature.getStyle() // grab the original feature's style

    this.setState({ style }) // save that style to state
  }

  onClick = () => {
    const { addEditFeatureToContext, feature } = this.props
 
    addEditFeatureToContext(feature)
    this.forceUpdate()
  }

  render () {
    const { translations } = this.props

    return (
      <div>
        <PopupActionItem title={translations['popup.editGeom'] || 'Edit Geometry'} onClick={this.onClick} />
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
  onEdit: PropTypes.func,
  addEditFeatureToContext: PropTypes.func
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
