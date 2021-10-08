import React, { Component } from 'react'
import PropTypes from 'prop-types'
import MenuItem from '@material-ui/core/MenuItem'
import { connectToContext } from 'Provider'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'

/**
 * @component
 * @category LayerPanel
 * @since 1.14.1
 */
class LayerPanelActionDuplicate extends Component {
  // incrementTitle(dupeLayer) {
  //   const { map } = this.props;
  //   const originalTitle = dupeLayer.get('title').trim()
  //   const layers = map.getLayers().getArray().filter(layer => layer instanceof VectorLayer || layer.isVectorLayer)
  //   const strippedTitle = originalTitle.replace(/\d+$/, '').trim()
  //   const count = layers.filter((layer) => {
  //     const includes = originalTitle.includes(layer.get('title').replace(/\d+$/, '').trim());
  //     return includes;
  //   }).length

  //   if ((strippedTitle !== originalTitle) && isNaN(strippedTitle.substr(-1).trim())) {
  //     return (!isNaN(originalTitle.substr(-1).trim()) ? originalTitle : strippedTitle) + ' ' + count.toString()
  //   }

  //   if( (strippedTitle !== originalTitle)) {
  //     return (count == 1 ? originalTitle : strippedTitle) + ' ' + count.toString()
  //   }
    
  //   return strippedTitle + ' ' + count.toString()
  // }
  incrementTitle(dupeLayer) {
    const { map } = this.props;
    const originalTitle = dupeLayer.get('title').trim()
    const layers = map.getLayers().getArray().filter(layer => layer instanceof VectorLayer || layer.isVectorLayer)
    const strippedTitle = originalTitle.replace(/\d+$/, '').trim()
    const count = layers.filter((layer) => {
      const includes = originalTitle.includes(layer.get('title').replace(/\d+$/, '').trim());
      return includes;
    }).length
    
    const exactCount = layers.filter(layer => layer.get('title').trim() === strippedTitle ).length;

    // if(!isNaN(strippedTitle.substr(-1).trim()) &&  !isNaN(originalTitle.substr(-1).trim()))
    // {
    //  return strippedTitle + ' ' + count.toString()
    // }

    // if(isNaN(strippedTitle.substr(-1).trim()) &&  !isNaN(originalTitle.substr(-1).trim()))
    // {
    //  return originalTitle + ' ' + count.toString()
    // }

    if( (strippedTitle !== originalTitle)) {
      return (count == 1 || exactCount == 0 || (exactCount == 1 && isNaN(strippedTitle.substr(-1)) && isNaN(originalTitle.substr(-1))) ? originalTitle : strippedTitle) + ' ' + count.toString()
    }
    
    return strippedTitle + ' ' + count.toString()
  }
  
  duplicateLayer = (layer) => {
    const { map, onLayerDuplicated, handleMenuClose } = this.props
    
    if (layer.isGeoserverLayer) {
        return layer;

    } else {
        const newTitle = this.incrementTitle(layer)
        const dupeFeatures = layer.getSource().getFeatures().map(feature => feature.clone())
        const source = new VectorSource({
          features: dupeFeatures
        });
        const properties = Object.assign(layer.getProperties(), { source, title: newTitle})
        const dupeLayer = new VectorLayer({...properties})
        map.addLayer(dupeLayer)

        onLayerDuplicated(dupeLayer)
        handleMenuClose()
    } 
  }

  render () {
    const { layer, translations } = this.props

    return (
      <MenuItem data-testid='LayerPanelAction.duplicate' key={'zoom'} onClick={() => this.duplicateLayer(layer)}>
        {translations['_ol_kit.actions.duplicate']}
      </MenuItem>
    )
  }
}

LayerPanelActionDuplicate.propTypes = {
  /** An openlayers `ol.map` object */
  map: PropTypes.object,

  /** An openlayers `ol.layer` */
  layer: PropTypes.object,

  /** A callback function that closes the `LayerPanelMenu` */
  handleMenuClose: PropTypes.func,

  /** A callback function that informs when a layer has been removed and passes that layer back to the IA */
  onLayerDuplicated: PropTypes.func,

  /** An object of translation key/value pairs */
  translations: PropTypes.object
}

LayerPanelActionDuplicate.defaultProps = {
  handleMenuClose: () => {},
  onLayerDuplicated: () => {}
}

export default connectToContext(LayerPanelActionDuplicate)
