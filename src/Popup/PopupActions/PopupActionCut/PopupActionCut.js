import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { PopupActionItem } from 'Popup'
import { connectToContext } from 'Provider'
import difference from '@turf/difference'
import booleanIntersects from '@turf/boolean-intersects'
import { Snackbar } from 'Snackbar'

import olFormatGeoJson from 'ol/format/GeoJSON'
import olLayerVector from 'ol/layer/Vector'

class ActionCut extends Component {
  constructor (props) {
    super(props)

    this.state = { showSnackbar: false }
  }

  cut = () => {
    const format = new olFormatGeoJson()
    const cutJsonFeature = format.writeFeatureObject(this.props.feature)

    delete cutJsonFeature.properties._ol_kit_parent
    const allFeaturesOnMap = this.props.map.getLayers().getArray().map(layer => {
      if (layer.isVectorLayer || layer instanceof olLayerVector) {
        return layer.getSource().getFeatures()
      }
    }).flat()
      .filter(feature => feature && feature.getId() !== this.props.feature.getId())
      .map(feature => {
        feature.unset('_ol_kit_parent')

        return feature
      })

    allFeaturesOnMap.forEach(feature => {
      const geoJsonFeature = format.writeFeatureObject(feature)

      if (booleanIntersects(geoJsonFeature, cutJsonFeature)) {
        const featureDiff = difference(geoJsonFeature, cutJsonFeature)
        const olCutFeature = format.readFeature(featureDiff)

        feature.setGeometry(olCutFeature.getGeometry())
      }
    })

    this.setState({ showSnackbar: true })
  }

  render () {
    const { showSnackbar } = this.state
    const { translations } = this.props

    return (
      <>
        <PopupActionItem title={translations['_ol_kit.PopupActionCut.title']} onClick={() => this.cut()} />
        <Snackbar
          open={showSnackbar}
          closeSnackbar={() => this.setState({ showSnackbar: false })}
          duration={5000}
          message={'_ol_kit.PopupActionCut.alert'}
          variant='info'/>
      </>
    )
  }
}

ActionCut.propTypes = {
  feature: PropTypes.object,
  /** Called with removed feature */
  onActionEnd: PropTypes.func,
  /** Object with key/value pairs for translated strings */
  translations: PropTypes.shape({
    '_ol_kit.PopupActionCut.title': PropTypes.string
  }).isRequired,
  map: PropTypes.object
}

ActionCut.defaultProps = {
  parentLayerKey: '_ol_kit_parent',
  translations: {
    '_ol_kit.PopupActionCut.title': 'Remove Feature',
    '_ol_kit.PopupActionCut.alert': 'Cut Complete!'
  }
}

export default connectToContext(ActionCut)
