import React, { Component } from 'react'
import PropTypes from 'prop-types'
import LayerPanelBase from 'LayerPanel/LayerPanelBase'
import LayerPanelLayersPage from 'LayerPanel/LayerPanelLayersPage'
import { connectToMap } from 'Map'

/**
 * @component
 * @category LayerPanel
 * @since 0.5.0
 */
class LayerPanel extends Component {
  render () {
    const { translations, children, theme, map } = this.props

    return (
      <LayerPanelBase translations={translations}>
        {[<LayerPanelLayersPage {...this.props} key='layerPanelLayersPage' map={map} />].concat(children)}
      </LayerPanelBase>
    )
  }
}

LayerPanel.propTypes = {
  /** Object with key/value pairs for translated strings */
  translations: PropTypes.object.isRequired,

  /** An Openlayers map object from which the layer panel will derive its layers */
  map: PropTypes.object.isRequired,

  /** A set of prebuilt page components (like `LayerPanelListPage`) or custom pages */
  children: PropTypes.node
}

export default connectToMap(LayerPanel)
