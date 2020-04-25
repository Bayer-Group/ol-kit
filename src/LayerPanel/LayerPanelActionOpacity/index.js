import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { OpacityWrapper, OpacityTitle, Slider } from './styled'

class LayerPanelActionOpacity extends Component {
  render () {
    const { layer } = this.props

    return (
      <OpacityWrapper>
        <OpacityTitle id='opacity-slider'>Opacity</OpacityTitle>
        <Slider
          disabled={false}
          min={0.1}
          max={1}
          step={0.1}
          defaultValue={layer.getOpacity()}
          onChangeCommitted={() => this.forceUpdate()}
          aria-labelledby='opacity-slider'
          onChange={(e, v) => layer.setOpacity(v) } />
      </OpacityWrapper>
    )
  }
}

LayerPanelActionOpacity.propTypes = {
  /** An openlayers `ol.layer` object */
  layer: PropTypes.object.isRequired
}

export default LayerPanelActionOpacity
