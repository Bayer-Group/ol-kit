import React from 'react'
import PropTypes from 'prop-types'
import olLayerTile from 'ol/layer/Tile'
import olSourceBingMaps from 'ol/source/BingMaps'
import { BasemapOption, BasemapThumbnail, Label } from './styled'
import { connectToContext } from 'Provider'

const DEFAULT_OPTS = {
  thumbnail: '',
  culture: 'en-us',
  imagerySet: 'Aerial',
  hidpi: false,
  cacheSize: 4096,
  maxZoom: 19,
  reprojectionErrorThreshold: 0,
  wrapX: true
}

/**
 * Bing basemap option (requires a Bing key to work properly)
 * @component
 * @category Basemap
 * @since 0.1.0
 */
class BasemapBingMaps extends React.Component {
  handleLayersChange = () => {
    this.forceUpdate()
  }

  componentDidMount () {
    this.props.map.getLayers().on('change', this.handleLayersChange)
  }

  componentWillUnmount () {
    this.props.map.getLayers().un('change', this.handleLayersChange)
  }

  onClick = () => {
    const { map, layerTypeID, layerID, sourceOpts, onBasemapChanged } = this.props
    const opts = { ...DEFAULT_OPTS, ...sourceOpts }
    const source = new olSourceBingMaps(opts)
    const layer = new olLayerTile({
      className: '_ol_kit_basemap_layer',
      [layerTypeID]: layerID, // make sure we can identify this layer as a layer that has been created from the ol-kit basemap component.
      source
    })
    const layers = map.getLayers()
    const layerArray = layers.getArray()
    const hasBasemap = layerTypeID && layerArray.length ? layerArray[0].get(layerTypeID) : false

    if (hasBasemap) {
      layers.setAt(0, layer)
    } else {
      layers.insertAt(0, layer)
    }
    layers.changed() // ol.Collection insertAt and setAt do not trigger a change event so we fire one manually so that we can rerender to display the active and inactive BasemapOptions
    onBasemapChanged(layer)
  }

  render () {
    const { translations, thumbnail, map, layerTypeID, layerID } = this.props
    const layerArray = map.getLayers().getArray()
    const isActive = layerArray.length ? layerArray[0].get(layerTypeID) === layerID : false

    return (
      <BasemapOption className='_ol_kit_basemapOption' isActive={isActive} onClick={this.onClick}>
        <BasemapThumbnail thumbnail={thumbnail} />
        <Label>{translations['_ol_kit.BingMaps.title']}</Label>
      </BasemapOption>
    )
  }
}

BasemapBingMaps.propTypes = {
  /** reference to Openlayers map object */
  map: PropTypes.object.isRequired,
  /** A unique string or symbol property name that will be set directly on the layer when it is created with a value containing a string identifying the type of basemap layer (e.g. '_ol_kit_basemap': 'osm').  This property should be a shared ID used to identify individual layers as 'basemap' layers. */
  layerTypeID: PropTypes.oneOfType([PropTypes.symbol, PropTypes.string]),
  /** An string or symbol ID unique to the layer that this component will create (e.g. 'bingAerial'). */
  layerID: PropTypes.oneOfType([PropTypes.symbol, PropTypes.string]),
  /** Object with key/value pairs for translated strings */
  translations: PropTypes.shape({
    '_ol_kit.BingMaps.title': PropTypes.string
  }),
  /** A string containing an http url or data url to a thumbnail image */
  thumbnail: PropTypes.string,
  /** A callback that is fired when the basemap layer has been changed.  It is called with the updated layer. */
  onBasemapChanged: PropTypes.func,
  /** The options object that will be used to create the ol/source/BingMaps (https://openlayers.org/en/latest/apidoc/module-ol_source_BingMaps-BingMaps.html) instance for the layer that this component adds to the map.  While there are default sourceOpts it is required that an object containing at least a valid BingMaps Maps key is passed down to this component (https://www.microsoft.com/en-us/maps/create-a-bing-maps-key). */
  sourceOpts: PropTypes.shape({
    key: PropTypes.string.isRequired
  }).isRequired
}

BasemapBingMaps.defaultProps = {
  onBasemapChanged: () => {},
  layerTypeID: '_ol_kit_basemap',
  thumbnail: '',
  layerID: 'bingAerial'
}

export default connectToContext(BasemapBingMaps)
