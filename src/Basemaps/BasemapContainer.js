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

/**
 * A basemap container that slides options up
 * @component
 * @category Basemaps
 * @since 0.6.0
 */
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
    const { variation, style, translations, logoPosition } = this.props
    const bottomStartingPoint = logoPosition === 'left' ? 25 : 14

    console.log(logoPosition)

    return basemapOptions.map((basemap, i) => {
      const zIndex = basemapOptions.length - i

      if (showBasemaps) {
        return (
          <BasemapSliderContainer
            variation={variation}
            style={style}
            zIndex={zIndex}
            left={0}
            bottom={bottomStartingPoint + (i * 90)}
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
            noBoxShadow={i !== 0}
            bottom={bottomStartingPoint}>
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
  /** reference to Openlayers map object */
  map: PropTypes.object,
  /** array of basemaps i.e. BasemapOpenStreetMap, BasemapStamenTerrain */
  basemapOptions: PropTypes.array,
  /** light or dark variation for styling */
  variation: PropTypes.string,
  /** apply inline styles to the map container */
  style: PropTypes.object,
  /** object of string key/values (see: locales) */
  translations: PropTypes.object,
  /** place the ol-kit logo on the 'left', 'right', or set to 'none' to hide */
  logoPosition: PropTypes.string
}

BasemapContainer.defaultProps = {
  basemapOptions: [
    <OpenStreetMap key='osm' thumbnail={osm} />,
    <StamenTerrain key='stamenTerrain' thumbnail={stamenTerrain} />,
    <StamenTonerDark key='stamenTonerDark' thumbnail={stamenTonerDark} />,
    <StamenTonerLite key='stamenTonerLite' thumbnail={stamenTonerLite} />,
    <BlankWhite key='blankWhite' />
  ],
  logoPosition: 'right'
}

export default connectToMap(BasemapContainer)
