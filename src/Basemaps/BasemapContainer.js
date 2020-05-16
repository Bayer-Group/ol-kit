import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { BasemapSliderContainer } from './styled'
import OpenStreetMap from './OpenStreetMap'
import BlankWhite from './BlankWhite'
import StamenTerrain from './StamenTerrain'
import StamenTonerDark from './StamenTonerDark'
import StamenTonerLite from './StamenTonerLite'
import { connectToMap } from 'Map'

const LAYER_TYPE_ID = '_ol_kit_basemap'

class BasemapContainer extends Component {
  constructor (props) {
    super(props)

    this.BASEMAP_OPTIONS = [
      <OpenStreetMap key='openStreetMap' layerTypeID={LAYER_TYPE_ID} map={props.map} />,
      <StamenTerrain key='stamenTerrain' layerTypeID={LAYER_TYPE_ID} map={props.map} />,
      <StamenTonerDark key='stamenTonerDark' layerTypeID={LAYER_TYPE_ID} map={props.map} />,
      <StamenTonerLite key='stamenTonerLite' layerTypeID={LAYER_TYPE_ID} map={props.map} />,
      <BlankWhite key='blankWhite' layerTypeID={LAYER_TYPE_ID} map={props.map} />
    ]

    this.state = {
      showBasemaps: false,
      basemapOptions: this.BASEMAP_OPTIONS
    }
  }

  componentDidMount () {
    this.props.map.on('click', () => this.setState({ showBasemaps: false }))
  }

  onBasemapChanged = (layer) => {
    const newBasemap = this.state.basemapOptions.find(basemap => basemap.key === layer.get('_ol_kit_basemap'))
    const newIndexOfBasemap = this.state.basemapOptions.indexOf(newBasemap)
    const selectedBasemap = this.state.basemapOptions.splice(newIndexOfBasemap, 1)

    this.setState({ showBasemaps: false, basemapOptions: [...selectedBasemap, ...this.state.basemapOptions] })
  }

  render () {
    const { showBasemaps, basemapOptions } = this.state

    return basemapOptions.map((basemap, i) => {
      const zIndex = basemapOptions.length - i

      if (showBasemaps) {
        return (
          <BasemapSliderContainer zIndex={zIndex} left={0} bottom={14 + (i * 90)} key={i}>
            {React.cloneElement(basemap, { onBasemapChanged: (layer) => this.onBasemapChanged(layer) })}
          </BasemapSliderContainer>
        )
      } else {
        return (
          <BasemapSliderContainer zIndex={zIndex} onClick={() => this.setState({ showBasemaps: true })} key={i}>
            {basemap}
          </BasemapSliderContainer>
        )
      }
    })
  }
}

BasemapContainer.propTypes = {
  map: PropTypes.object
}

export default connectToMap(BasemapContainer)
