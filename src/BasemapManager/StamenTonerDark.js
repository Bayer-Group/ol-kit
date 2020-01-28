import React from 'react'
import PropTypes from 'prop-types'
import olLayerTile from 'ol/layer/tile'
import olSourceStamen from 'ol/source/stamen'
import { BasemapOption, BasemapThumbnail, Label } from './styled'
import { stamenTonerDark } from './thumbnails'
import { connectToMap } from 'Map'

class StamenTonerDark extends React.Component {
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
    const source = new olSourceStamen({
      layer: 'toner',
      url: 'https://stamen-tiles-{a-d}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png',
      maxZoom: 18,
      cacheSize: 40
    })
    const layer = new olLayerTile({
      preload: Infinity,
      extent: undefined,
      source
    })
    const { map, layerTypeID, onBasemapChanged } = this.props

    layer[layerTypeID] = 'stamenTonerDark' // make sure we can identify this layer as a layer that has been created from the ol-kit basemap component.

    const layers = map.getLayers()
    const layerArray = layers.getArray()
    const hasBasemap = layerTypeID && layerArray.length ? layerArray[0][layerTypeID] : false

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
    const label = translations.label
    const layerArray = map.getLayers().getArray()
    const isActive = layerArray.length ? layerArray[0][layerTypeID] === stamenTonerDark : false

    return (
      <BasemapOption isActive={isActive} onClick={this.onClick}>
        <BasemapThumbnail thumbnail={thumbnail} />
        <Label>{label}</Label>
      </BasemapOption>
    )
  }
}

StamenTonerDark.propTypes = {
  map: PropTypes.object.isRequired,
  /** Object with key/value pairs for translated strings */
  translations: PropTypes.shape({
    label: PropTypes.string
  }),
  /** A string containing an http url or data url to a thumbnail image */
  thumbnail: PropTypes.string,
  /** A unique string or symbol property name that will be set directly on the layer when it is created with a value containing a string identifying the type of basemap layer (e.g. '_ol_kit_basemap': 'osm').  This property should be a shared ID used to identify individual layers as 'basemap' layers.  */
  layerTypeID: PropTypes.oneOfType([PropTypes.symbol, PropTypes.string]),
  /** A callback that is fired when the basemap layer has been changed.  It is called with the updated layer. */
  onBasemapChanged: PropTypes.func
}

StamenTonerDark.defaultProps = {
  thumbnail: stamenTonerDark,
  onBasemapChanged: () => {},
  translations: {
    label: 'Stamen Toner Dark'
  },
  layerTypeID: '_ol_kit_basemap'
}

export default connectToMap(StamenTonerDark)
