import React from 'react'
import PropTypes from 'prop-types'
import { ManageLayer as VmcManageLayer } from 'vmc'
import olObservable from 'ol/observable'

// TODO fix this
import { addMovementListener } from 'utils/events'

class LayerStyler extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      attributeValues: [],
      listeners: []
    }
  }

  componentDidMount () {
    const { map } = this.props
    const layers = map.getLayers()

    // if a layer is added or removed, the list of layers should be updated
    const handleMapChange = (e) => this.forceUpdate()

    // bind the event listeners
    this.onAddKey = layers.on('add', handleMapChange)
    this.onRemoveKey = layers.on('remove', handleMapChange)

    // make sure the attributes get updated each time the view extent changes
    const listeners = addMovementListener(map, () => this.forceUpdate())

    this.setState({ listeners })
  }

  componentWillUnmount () {
    const { listeners } = this.state

    listeners.forEach(listener => olObservable.unByKey(listener))
  }

  getTitleForLayer = (layer) => {
    return layer.get('title') || layer.getTypeName() || 'untitled layer'
  }

  getAttributesForLayer = layer => {
    if (layer && layer.isVectorLayer) {
      return layer.getAttributes().sort((a, b) => a.localeCompare(b))
    }
  }

  getValuesForAttribute = async (layer, attribute) => {
    if (layer && layer.isVectorLayer) {
      const attributeValues = layer.fetchValuesForAttribute(attribute)

      this.setState({ attributeValues })
    }
  }

  onFilterChange = (layer, filters) => {
    // if (layer && layer.isGeoserverLayer) {
    //   const { typeName } = layer
    //   const whitelistedLayer = this.state.whitelistedLayers.find(l => l.typename === typeName)
    //   const opts = whitelistedLayer ? { commaDelimitedAttributes: whitelistedLayer.commaDelimitedAttributes } : {}

    //   layer.setWMSFilters(filters, opts)

    //   // cause a re-render which will re-hydrate the latest styles
    //   this.forceUpdate()
    // }
  }

  onDefaultStyleChange = (layer, styles) => {
    if (layer && layer.isVectorLayer) {
      layer.updateDefaultVectorStyles(styles)

      // cause a re-render which will re-hydrate the latest styles
      this.forceUpdate()
    }
  }

  onUserStyleChange = (layer, styles) => {
    if (layer && layer.isVectorLayer) {
      layer.setUserVectorStyles(styles)

      // cause a re-render which will re-hydrate the latest styles
      this.forceUpdate()
    }
  }

  onDefaultStyleReset = (layer) => {
    if (layer && layer.isVectorLayer) {
      layer.resetDefaultVectorStyles()

      // cause a re-render which will re-hydrate the latest styles
      this.forceUpdate()
    }
  }

  render () {
    const layers = this.props.map.getLayers().getArray().filter(l => l.isVectorLayer)
    const { attributeValues } = this.state
    const { translations } = this.props

    return (
      <VmcManageLayer
        layers={layers}
        translations={translations}
        filters={layers.map(l => l.getWMSFilters())}
        userStyles={layers.map(l => l.getUserWMSStyles())}
        defaultStyles={layers.map(l => l.getDefaultWMSStyles())}
        getCommaDelimitedAttributesForLayer={this.getCommaDelimitedAttributesForLayer}
        getTitleForLayer={this.getTitleForLayer}
        getValuesForAttribute={this.getValuesForAttribute}
        getAttributesForLayer={this.getAttributesForLayer}
        attributeValues={attributeValues}
        onFilterChange={this.onFilterChange}
        onUserStyleChange={this.onUserStyleChange}
        onDefaultStyleChange={this.onDefaultStyleChange}
        onDefaultStyleReset={this.onDefaultStyleReset}
        {...this.props} />
    )
  }
}

LayerStyler.propTypes = {
  /** Object with key/value pairs for translated strings */
  translations: PropTypes.object,

  /** Openlayers map object */
  map: PropTypes.object.isRequired,
}

export default LayerStyler
