import React, { Component } from 'react'
import PropTypes from 'prop-types'
import LayerPanelBase from 'LayerPanel/LayerPanelBase'
import LayerPanelLayersPage from 'LayerPanel/LayerPanelLayersPage'
import { connectToContext } from 'Provider'
/**
 * @component
 * @category LayerPanel
 * @since 0.5.0
 */
class LayerPanel extends Component {
  render () {
    const { translations, children, map, opacity, layerPanelTitle, disableHover, setHoverStyle } = this.props

    return (
      <LayerPanelBase translations={translations} opacity={opacity} layerPanelTitle={layerPanelTitle}>
        {[<LayerPanelLayersPage label='Layers' {...this.props} key='layerPanelLayersPage' map={map} disableHover={disableHover} setHoverStyle={setHoverStyle}/>].concat(children)}
      </LayerPanelBase>
    )
  }
}

LayerPanel.defaultProps = {
  layerPanelTitle: 'Layer Panel',
  disableHover: false
}

LayerPanel.propTypes = {
  /** Object with key/value pairs for translated strings */
  translations: PropTypes.object.isRequired,

  /** An Openlayers map object from which the layer panel will derive its layers */
  map: PropTypes.object.isRequired,

  /** A set of prebuilt page components (like `LayerPanelListPage`) or custom pages */
  children: PropTypes.node,

  /** A float number for the opacity of the LayerPanel. i.e. (0.5) */
  opacity: PropTypes.number,

  /** Title of the LayerPanel */
  layerPanelTitle: PropTypes.string,

  /** Truthy value will disable hover */
  disableHover: PropTypes.bool,

  /** Pass fill, stroke, and color hover style values */
  setHoverStyle: PropTypes.func
}

export default connectToContext(LayerPanel)
