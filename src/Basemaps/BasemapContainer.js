import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { BasemapThumbnail, Label, BasemapSliderContainer, BasemapOption } from './styled'
import { stamenTerrain, osm, stamenTonerDark, stamenTonerLite } from './thumbnails'
import OpenStreetMap from './OpenStreetMap'
import BlankWhite from './BlankWhite'
import StamenTerrain from './StamenTerrain'
import StamenTonerDark from './StamenTonerDark'
import StamenTonerLite from './StamenTonerLite'
import { connectToMap } from 'Map'

class BasemapContainer extends Component {
  constructor (props) {
    super(props)

    this.state = {
      showBasemaps: false,
      basemapOptions: props.basemapOptions
    }
  }

  componentDidUpdate (_, prevState) {
    if (prevState.showBasemaps !== this.state.showBasemaps && this.state.showBasemaps === true) {
      this.props.map.on('click', () => this.setState({ showBasemaps: false }))
    } else {
      this.props.map.un('click', () => this.setState({ showBasemaps: false }))
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
    const { variation, style, translations } = this.props

    return basemapOptions.map((basemap, i) => {
      const zIndex = basemapOptions.length - i

      if (showBasemaps) {
        return (
          <BasemapSliderContainer
            variation={variation}
            style={style}
            zIndex={zIndex}
            left={0}
            bottom={14 + (i * 90)}
            key={i}>
            {React.cloneElement(basemap, { onBasemapChanged: (layer) => this.onBasemapChanged(layer) })}
          </BasemapSliderContainer>
        )
      } else {
        return (
          <BasemapSliderContainer
            variation={variation}
            style={style}
            zIndex={zIndex}
            onClick={() => this.setState({ showBasemaps: true })}
            key={i}
            noBoxShadow={i !== 0}>
            <BasemapOption>
              <BasemapThumbnail thumbnail={basemap.props.thumbnail} />
              <Label>{translations[`_ol_kit.${basemap.key}.title`]}</Label>
            </BasemapOption>
          </BasemapSliderContainer>
        )
      }
    })
  }
}

BasemapContainer.propTypes = {
  map: PropTypes.object,
  basemapOptions: PropTypes.array,
  variation: PropTypes.string,
  style: PropTypes.object,
  translations: PropTypes.object
}

BasemapContainer.defaultProps = {
  basemapOptions: [
    <OpenStreetMap key='osm' thumbnail={osm} />,
    <StamenTerrain key='stamenTerrain' thumbnail={stamenTerrain} />,
    <StamenTonerDark key='stamenTonerDark' thumbnail={stamenTonerDark} />,
    <StamenTonerLite key='stamenTonerLite' thumbnail={stamenTonerLite} />,
    <BlankWhite key='blankWhite' />
  ]
}

export default connectToMap(BasemapContainer)
