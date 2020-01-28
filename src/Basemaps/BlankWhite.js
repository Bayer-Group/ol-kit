import React from 'react'
import PropTypes from 'prop-types'
import olLayerVector from 'ol/layer/vector'
import olSourceVector from 'ol/source/vector'
import { BasemapOption, BasemapThumbnail, Label } from './styled'
import { connectToMap } from 'Map'

class BlankWhite extends React.Component {
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
    const layer = new olLayerVector({
      source: new olSourceVector()
    })
    const { map, layerTypeID, onBasemapChanged } = this.props

    layer[layerTypeID] = 'blankWhite' // make sure we can identify this layer as a layer that has been created from the ol-kit basemap component.

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
    const isActive = layerArray.length ? layerArray[0][layerTypeID] === 'blankWhite' : false

    return (
      <BasemapOption className='_ol_kit_basemapOption' isActive={isActive} onClick={this.onClick}>
        <BasemapThumbnail thumbnail={thumbnail} />
        <Label>{label}</Label>
      </BasemapOption>
    )
  }
}

BlankWhite.propTypes = {
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

BlankWhite.defaultProps = {
  thumbnail: '',
  onBasemapChanged: () => {},
  translations: {
    label: 'Blank White'
  },
  layerTypeID: '_ol_kit_basemap'
}

export default connectToMap(BlankWhite)
