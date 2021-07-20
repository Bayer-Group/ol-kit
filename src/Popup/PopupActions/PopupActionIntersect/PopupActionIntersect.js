import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { PopupActionItem } from 'Popup'
import { connectToContext } from 'Provider'
import booleanIntersects from '@turf/boolean-intersects'
import { boundingExtent } from 'ol/extent'
import { Snackbar } from 'Snackbar'

import olFormatGeoJson from 'ol/format/GeoJSON'
import olLayerVector from 'ol/layer/Vector'

class ActionIntersect extends Component {
  constructor(props) {
    super(props)

    this.state = { showSnackbar: false }
  }

  toTwoDCoords = (coords) => {
    const flatCoords = coords.flat(Infinity)
    let out = []

    for (let i = 0; i < flatCoords.length; i++) {
      out.push([flatCoords[i], flatCoords[i++]])
    }

    return out
  }

  intersect = () => {
    const { optLayers, map, feature, onActionEnd } = this.props
    const format = new olFormatGeoJson()
    const searchJsonFeature = format.writeFeatureObject(feature)
    const layers = optLayers || map.getLayers().getArray()

    delete searchJsonFeature.properties._ol_kit_parent
    const intersectingFeatures = layers.map(layer => {
      if (layer.isVectorLayer || layer instanceof olLayerVector) {
        return layer.getSource().getFeatures()
      }
    }).flat()
      .filter(f => {
        if (!f || f?.getId?.() === feature.getId()) return false
        const geoJsonFeature = format.writeFeatureObject(f)

        return booleanIntersects(geoJsonFeature, searchJsonFeature)
      })

    this.setState({ showSnackbar: true }, () => onActionEnd(intersectingFeatures))
  }

  render() {
    const { translations } = this.props
    const { showSnackbar } = this.state

    return (
      <>
        <PopupActionItem title={translations['_ol_kit.PopupActionIntersect.title'] || 'Spatial Search'} onClick={this.intersect} />
        <Snackbar
          open={showSnackbar}
          closeSnackbar={() => this.setState({ showSnackbar: false })}
          duration={5000}
          message={translations['_ol_kit.PopupActionIntersect.alert']}
          variant='info' />
      </>
    )
  }
}

ActionIntersect.propTypes = {
  feature: PropTypes.object,
  /** Called with removed feature */
  onActionEnd: PropTypes.func,
  /** Object with key/value pairs for translated strings */
  translations: PropTypes.shape({
    '_ol_kit.PopupActionIntersect.title': PropTypes.string,
    '_ol_kit.PopupActionIntersect.alert': PropTypes.string
  }),
  map: PropTypes.object,
  optLayers: PropTypes.array,
}

ActionIntersect.defaultProps = {
  parentLayerKey: '_ol_kit_parent',
  translations: {
    '_ol_kit.PopupActionIntersect.title': 'Spatial Search',
    '_ol_kit.PopupActionIntersect.alert': 'Search Complete!'
  }
}

export default connectToContext(ActionIntersect)
