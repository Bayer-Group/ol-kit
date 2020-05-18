import React from 'react'
import PropTypes from 'prop-types'
import olLayerTile from 'ol/layer/tile'
import olSourceStamen from 'ol/source/stamen'
import { BasemapOption, BasemapThumbnail, Label } from './styled'
import { stamenTerrain } from './thumbnails'
import { connectToMap } from 'Map'; // eslint-disable-line

/**
 * Stamen terrain basemap option
 * @component
 * @category Basemap
 * @since 0.1.0
 */
class BasemapStamenTerrain extends React.Component {
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
    const { map, layerTypeID, onBasemapChanged } = this.props
    const source = new olSourceStamen({
      layer: 'terrain',
      url: 'https://stamen-tiles-{a-d}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png',
      maxZoom: 18,
      cacheSize: 4096
    })
    const layer = new olLayerTile({
      preload: Infinity,
      extent: undefined,
      [layerTypeID]: 'stamenTerrain', // make sure we can identify this layer as a layer that has been created from the ol-kit basemap component.
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
    const { translations, thumbnail, map, layerTypeID } = this.props
    const layerArray = map.getLayers().getArray()
    const isActive = layerArray.length ? layerArray[0].get(layerTypeID) === 'stamenTerrain' : false

    return (
      <BasemapOption className='_ol_kit_basemapOption' isActive={isActive} onClick={this.onClick}>
        <BasemapThumbnail thumbnail={thumbnail} />
        <Label>{translations['_ol_kit.StamenTerrain.title']}</Label>
      </BasemapOption>
    )
  }
}

BasemapStamenTerrain.propTypes = {
  /** reference to Openlayers map object */
  map: PropTypes.object.isRequired,
  /** Object with key/value pairs for translated strings */
  translations: PropTypes.shape({
    '_ol_kit.StamenTerrain.title': PropTypes.string
  }),
  /** A string containing an http url or data url to a thumbnail image */
  thumbnail: PropTypes.string,
  /** A unique string or symbol property name that will be set directly on the layer when it is created with a value containing a string identifying the type of basemap layer (e.g. '_ol_kit_basemap': 'osm').  This property should be a shared ID used to identify individual layers as 'basemap' layers.  */
  layerTypeID: PropTypes.oneOfType([PropTypes.symbol, PropTypes.string]),
  /** A callback that is fired when the basemap layer has been changed.  It is called with the updated layer. */
  onBasemapChanged: PropTypes.func
}

BasemapStamenTerrain.defaultProps = {
  thumbnail: stamenTerrain,
  onBasemapChanged: () => {},
  layerTypeID: '_ol_kit_basemap'
}

export default connectToMap(BasemapStamenTerrain)
