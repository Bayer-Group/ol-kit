import React, { Component } from 'react'
import PropTypes from 'prop-types'
import MenuItem from '@material-ui/core/MenuItem'
import olLayerVector from 'ol/layer/Vector'
import { connectToContext } from 'Provider'
import en from 'locales/en'
import { addVectorLayer } from '../LayerPanelActionMerge/utils'
import { mergeLayerFeatures } from './utils'

/**
 * @component
 * @category LayerPanel
 * @since 1.15.1
 */
class LayerPanelActionMergeFeatures extends Component {
  handleMerge = () => {
    const { map, layer, onMergeFeatures, handleMenuClose } = this.props
    // merge all feature geoms into new geometry
    const mergedGeometry = mergeLayerFeatures(layer)
    // create new ol feature w new geometry
    const newFeature = new olFeature({ geometry: mergedGeometry, name: 'Merged Feature' })
    const opts = { title: 'Merged Layer' }
    const mergedLayer = addVectorLayer(map, [newFeature], opts)

    onMergeFeatures(mergedLayer)
    handleMenuClose()
  }

  isValidVectorLayer = (layer) => {
    return (layer instanceof olLayerVector || (layer && layer.isVectorLayer))
  }

  getVisibleLayers = () => {
    return this.props.layers.filter(layer => layer.getVisible())
  }

  featuresAreMergable = () => {
    const { layer } = this.props
    // check layer feature types all match (all polygon, all point, all line, etc)
    const features = layer.getSource().getFeatures()
    const featureTypes = features.map((feature) => feature.getGeometry().getType())
    const distinctTypes = [...new Set(featureTypes)]  
    return (distinctTypes === 1 && features.length > 1)  ? true : false
  }

  render () {
    const { translations } = this.props
    const isVisible = layer.getVisible()

    return (
      <MenuItem
        key='mergeFeatures'
        data-testid='LayerPanelAction.mergeFeatures'
        disableGutters={false}
        disabled={!isVisible && !this.featuresAreMergable()}
        onClick={this.handleMerge} >
        {translations['_ol_kit.LayerPanelActions.mergeFeatures']}
      </MenuItem>
    )
  }
}

LayerPanelActionMergeFeatures.propTypes = {
  /** A function that closes the LayerPanelMenu */
  handleMenuClose: PropTypes.func,

  /** An array of openlayers layers */
  layers: PropTypes.array.isRequired,

  /** An openlayers `ol.layer` object */
  layer: PropTypes.object,

  /** Openlayers map */
  map: PropTypes.object.isRequired,

  /** Callback fired after merge, called with new feature as argument */
  onMergeFeatures: PropTypes.func,

  /** An object of translation key/value pairs */
  translations: PropTypes.object.isRequired
}

LayerPanelActionMergeFeatures.defaultProps = {
  handleMenuClose: () => {},
  onMergeFeatures: () => {},
  translations: en
}

export default connectToContext(LayerPanelActionMergeFeatures)
