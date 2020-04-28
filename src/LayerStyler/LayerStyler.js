import React from 'react'
import PropTypes from 'prop-types'
import StyleManager from 'LayerStyler/StyleManager'
import olObservable from 'ol/observable'
import olFormatFilterAnd from 'ol/format/filter/and'
import olFormatFilterOr from 'ol/format/filter/or'
import olFormatFilterEqualTo from 'ol/format/filter/equalto'
import olFormatFilterIsLike from 'ol/format/filter/islike'
import olFilterFunction from '../classes/FilterFunction'
import ugh from 'ugh'

import escapeRegExp from 'lodash.escaperegexp'

import { addMovementListener } from './utils'
import { connectToMap } from 'Map'

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
    return layer?.get?.('title') || layer?.getTypeName?.() || 'untitled layer'
  }

  getAttributesForLayer = layer => {
    if (layer) {
      if (layer.isGeoserverLayer) {
        return layer.getAttributes().sort((a, b) => a.localeCompare(b))
      } else if (layer.isVectorLayer) {
        return layer.getAttributes().sort((a, b) => a.localeCompare(b))
      }
    }
  }

  getValuesForAttribute = async (layer, attribute) => {
    if (layer) {
      if (layer.isGeoserverLayer) {
        const { typeName } = layer
        const whitelistedLayer = this.state.whitelistedLayers.find(l => l.typename === typeName)
        const opts = whitelistedLayer ? { commaDelimitedAttributes: whitelistedLayer.commaDelimitedAttributes } : {}
        const attributeValues = await layer.fetchValuesForAttribute(this.props.map, attribute, opts)

        this.setState({ attributeValues })
      } else if (layer.isVectorLayer) {
        const attributeValues = layer.fetchValuesForAttribute(attribute)

        this.setState({ attributeValues })
      }
    }
  }

  getCommaDelimitedAttributesForLayer = (layer) => {
    if (layer && layer.isGeoserverLayer) {
      const { typeName } = layer
      const whitelistedLayer = this.state.whitelistedLayers.find(l => l.typename === typeName)

      return whitelistedLayer ? whitelistedLayer.commaDelimitedAttributes : []
    }
  }

  onFilterChange = (layer, filters) => {
    if (layer && layer.isGeoserverLayer) {
      const { typeName } = layer
      const whitelistedLayer = this.state.whitelistedLayers.find(l => l.typename === typeName)
      const opts = whitelistedLayer ? { commaDelimitedAttributes: whitelistedLayer.commaDelimitedAttributes } : {}

      layer.setWMSFilters(filters, opts)
      layer.setOlFilters(this.setOlFilters(filters, opts))

      // cause a re-render which will re-hydrate the latest styles
      this.forceUpdate()
    }
  }

  setOlFilters = (filters = [], opts) => {
    const olFilters = filters.map(({ attribute, value }) => {
      if (opts.commaDelimitedAttributes && opts.commaDelimitedAttributes.includes(attribute)) {
        // this filter is due to commaDelimitedAttributes, we have to make an OR filter with 3 regex filters
        // the olFilterFunction is our custom filter function due to openlayers not supporting functions as filters
        return new olFormatFilterOr(
          new olFormatFilterIsLike(new olFilterFunction('strMatches', attribute, `^${escapeRegExp(value)}( )??,.*`), true, '*', '.', '!'),
          new olFormatFilterIsLike(new olFilterFunction('strMatches', attribute, `.*,( )??${escapeRegExp(value)}( )??,.*`), true, '*', '.', '!'),
          new olFormatFilterIsLike(new olFilterFunction('strMatches', attribute, `.*,( )??${escapeRegExp(value)}( )??,.*`), true, '*', '.', '!'),
          new olFormatFilterEqualTo(attribute, escapeRegExp(value))
        )
      } else {
        return new olFormatFilterEqualTo(attribute, value)
      }
    })

    if (filters[0]?.logical === 'AND' && filters.length > 1) {
      return new olFormatFilterAnd(...olFilters)
    } else if (filters[0]?.logical === 'OR' && filters.length > 1) {
      return new olFormatFilterOr(...olFilters)
    } else {
      return olFilters[0]
    }
  }

  onDefaultStyleChange = (layer, styles) => {
    if (layer && layer.isGeoserverLayer) {
      layer.setDefaultWMSStyles(styles)
    } else {
      layer.updateDefaultVectorStyles(styles)
    }

    // cause a re-render which will re-hydrate the latest styles
    this.forceUpdate()
  }

  onUserStyleChange = (layer, styles) => {
    if (layer && layer.isGeoserverLayer) {
      layer.setUserWMSStyles(styles)
    } else if (layer && layer.isVectorLayer) {
      layer.setUserVectorStyles(styles)
    }

    // cause a re-render which will re-hydrate the latest styles
    this.forceUpdate()
  }

  onDefaultStyleReset = (layer) => {
    if (layer && layer.isGeoserverLayer) {
      layer.resetDefaultWMSStyles()
    } else if (layer.isVectorLayer) {
      layer.resetDefaultVectorStyles()
    }

    // cause a re-render which will re-hydrate the latest styles
    this.forceUpdate()
  }

  getValidLayers = () => {
    const { map } = this.props
    const layers = map.getLayers().getArray()
    const validLayers = layers.filter(layer => {
      return !layer.get('_ol_kit_basemap') && (layer.isGeoserverLayer || layer.isVectorLayer)
    })

    if (layers.length - validLayers.length > 1) {
      ugh.warn('In order to use ManageLayers, the layer must be either an VectorLayer or GeoserverLayer')
    }

    return validLayers
  }

  render () {
    const layers = this.props.map.getLayers().getArray()
    const { attributeValues } = this.state
    const { translations } = this.props

    return (
      <StyleManager
        layers={layers}
        translations={translations}
        filters={layers.map(l => l.isGeoserverLayer && l.getWMSFilters())}
        userStyles={layers.map(l => l.isGeoserverLayer ? l.getUserWMSStyles() : l.getUserVectorStyles?.())}
        defaultStyles={layers.map(l => l.isGeoserverLayer ? l.getDefaultWMSStyles() : l.getDefaultVectorStyles?.())}
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
  translations: PropTypes.object.isRequired,

  /** Openlayers map object */
  map: PropTypes.object.isRequired
}

export default connectToMap(LayerStyler)
