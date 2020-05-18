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

    this.state = {
      showBasemaps: false,
      basemapOptions: props.baseMapOptions
    }
  }

  componentDidMount () {
    if (this.state.showBasemaps) {
      this.props.map.on('click', () => this.setState({ showBasemaps: false }))
    }
  }

  onBasemapChanged = (layer) => {
    const clonedBasemapOptions = [...this.state.basemapOptions]
    const newBasemap = clonedBasemapOptions.find(basemap => basemap.key === layer.get('_ol_kit_basemap'))
    const newIndexOfBasemap = clonedBasemapOptions.indexOf(newBasemap)
    const selectedBasemap = clonedBasemapOptions.splice(newIndexOfBasemap, 1)

    this.setState({ showBasemaps: false, basemapOptions: [...selectedBasemap, ...clonedBasemapOptions] })
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
  map: PropTypes.object,
  baseMapOptions: PropTypes.basemapOptions
}

BasemapContainer.defaultProps = {
  basemapOptions: [
    <OpenStreetMap key='openStreetMap' layerTypeID={LAYER_TYPE_ID} />,
    <StamenTerrain key='stamenTerrain' layerTypeID={LAYER_TYPE_ID} />,
    <StamenTonerDark key='stamenTonerDark' layerTypeID={LAYER_TYPE_ID} />,
    <StamenTonerLite key='stamenTonerLite' layerTypeID={LAYER_TYPE_ID} />,
    <BlankWhite key='blankWhite' layerTypeID={LAYER_TYPE_ID} />
  ]
}

export default connectToMap(BasemapContainer)
