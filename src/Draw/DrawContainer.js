import React from 'react'
import olLayerVector from 'ol/layer/vector'
import { Draw, connectToMap } from '@bayer/ol-kit'
import olSourceVector from 'ol/source/vector'
import PropTypes from 'prop-types'
import nanoid from 'nanoid'

class DrawContainer extends React.Component {
  constructor () {
    super()

    this.state = {
      measureFeature: false
    }

    this.onDrawStart = this.onDrawStart.bind(this)
    this.onDrawCancel = this.onDrawCancel.bind(this)
    this.onDrawEnd = this.onDrawEnd.bind(this)
  }

  getLayer () {
    const title = this.state.measureFeature ? 'Measurements Layer' : 'Annotations Layer'
    const layers = this.props.map.getLayers().getArray()
    const exists = layers.find(l => l.get('_vmf_title') === title)

    if (exists) {
      return exists
    } else {
      const layer = new olLayerVector({
        _vmf_id: nanoid(),
        _vmf_title: title,
        title: 'Annotations',
        source: new olSourceVector()
      })

      this.props.map.addLayer(layer)

      return layer
    }
  }

  onDrawEnd (feature) {
    console.debug('%cDrawEnd', 'color: cyan; font-style: italic;', feature) // eslint-disable-line

    const layer = this.getLayer()

    layer.getSource().addFeature(feature)
    feature.set('_ol_kit_parent', layer)
    feature.set('_ol_kit_annotation', true)
    feature.set('_vmf_id', nanoid())

    this.setState({ measureFeature: false })
  }

  onDrawStart (feature) {
    this.setState({ measureFeature: feature.get('_vmf_type') === '_vmf_measurement' })
    console.debug('%cDrawStart', 'color: magenta; font-style: italic;') // eslint-disable-line
  }

  onInteractionAdded (interaction) {
    console.debug('%cInteractionAdded', 'color: yellow; font-style: italic;', interaction) // eslint-disable-line
  }

  onDrawCancel (interaction) {
    console.debug('%cDrawCancel', 'color: white; background-color: red; border-radius: 4px; font-style: italic;', interaction) // eslint-disable-line
    this.setState({ measureFeature: false })
  }

  render () {
    return (
      <Draw
        {...this.props}
        onDrawFinish={this.onDrawEnd}
        onDrawBegin={this.onDrawStart}
        onInteractionAdded={this.onInteractionAdded}
        onDrawCancel={this.onDrawCancel}
        selectInteraction={this.props.selectInteraction} />
    )
  }
}

DrawContainer.propTypes = {
  /** openlayers map */
  map: PropTypes.object.isRequired,
  /** reference to openlayers select interaction which can optionally be managed by IA */
  selectInteraction: PropTypes.object
}

export default connectToMap(DrawContainer)
