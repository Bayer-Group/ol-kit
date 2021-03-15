import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Snackbar } from 'Snackbar'
import olFeature from 'ol/Feature'
import VectorLayer from 'classes/VectorLayer'
import olSourceVector from 'ol/Source/Vector'

import { PopupActionItem } from 'Popup'
import { connectToContext } from 'Provider'

class ActionDuplicate extends Component {
  constructor (props) {
    super(props)

    this.state = { showSnackbar: false }
  }

  duplicate = () => {
    const { feature, onActionEnd, map, translations } = this.props
    const geometry = feature.getGeometry().clone()
    const clone = new olFeature({ geometry, name: 'Duplicated shape' })

    if (typeof onActionEnd === 'function') {
      onActionEnd(clone)
    } else {
      const layer = new VectorLayer({
        title: translations['_ol_kit.PopupActionDuplicate.title'],
        source: new olSourceVector()
      })

      clone.setStyle(null)
      layer.getSource().addFeature(clone)

      map.addLayer(layer)
    }

    this.setState({ showSnackbar: true })
  }

  render () {
    const { translations } = this.props
    const { showSnackbar } = this.state

    return (
      <>
        <PopupActionItem title={translations['_ol_kit.PopupActionDuplicate.title']} onClick={this.duplicate} />
        <Snackbar
          open={showSnackbar}
          closeSnackbar={() => this.setState({ showSnackbar: false })}
          duration={5000}
          message={translations['_ol_kit.PopupActionDuplicate.alert']}
          variant='info'/>
      </>
    )
  }
}

ActionDuplicate.propTypes = {
  /** olFeature to duplicate */
  feature: PropTypes.object,
  /** Callback function that will inform when action is complete */
  onActionEnd: PropTypes.func,
  /** olMap */
  map: PropTypes.object,
  /** Object with key/value pairs for translated strings */
  translations: PropTypes.shape({
    '_ol_kit.PopupActionDuplicate.alert': PropTypes.string,
    '_ol_kit.PopupActionDuplicate.title': PropTypes.string
  }).isRequired
}

ActionDuplicate.defaultProps = {
  translations: {
    '_ol_kit.PopupActionDuplicate.alert': 'Shape duplicated!',
    '_ol_kit.PopupActionDuplicate.title': 'Duplicate Shape'
  }
}

export default connectToContext(ActionDuplicate)
