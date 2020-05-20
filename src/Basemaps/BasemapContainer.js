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
 * @category Basemap
 * @since 0.7.0
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
      this.props.map.on('click', this.hideBasemaps)
    } else {
      this.props.map.un('click', this.hideBasemaps)
    }
  }

  onBasemapChanged = (layer) => {
    const { layerTypeID } = this.props
    const clonedBasemapOptions = [...this.state.basemapOptions]
    const newBasemap = clonedBasemapOptions.find(basemap => basemap.key === layer.get(layerTypeID))
    const newIndexOfBasemap = clonedBasemapOptions.indexOf(newBasemap)
    const selectedBasemap = clonedBasemapOptions.splice(newIndexOfBasemap, 1)

    this.setState({ showBasemaps: false, basemapOptions: [...selectedBasemap, ...clonedBasemapOptions] })
  }

  hideBasemaps = () => {
    this.setState({ showBasemaps: false })
  }

  render () {
    const { showBasemaps, basemapOptions } = this.state
    const { variation, style, translations } = this.props

    return basemapOptions.map((basemap, i) => {
      const zIndex = basemapOptions.length - i
      const translationKey = (key) => {
        if (key === 'osm') {
          return 'OpenStreetMap'
        } else {
          return key[0].toUpperCase() + key.slice(1)
        }
      }

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
              <Label>{translations[`_ol_kit.${translationKey(basemap.key)}.title`]}</Label>
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
  /** A unique string or symbol property name that will be set directly on the layer when it is created with a value containing a string identifying the type of basemap layer (e.g. '_ol_kit_basemap': 'osm').  This property should be a shared ID used to identify individual layers as 'basemap' layers. */
  layerTypeID: PropTypes.oneOfType([PropTypes.symbol, PropTypes.string])
}

BasemapContainer.defaultProps = {
  basemapOptions: [
    <OpenStreetMap key='osm' thumbnail={osm} />,
    <StamenTerrain key='stamenTerrain' thumbnail={stamenTerrain} />,
    <StamenTonerDark key='stamenTonerDark' thumbnail={stamenTonerDark} />,
    <StamenTonerLite key='stamenTonerLite' thumbnail={stamenTonerLite} />,
    <BlankWhite key='blankWhite' />
  ],
  layerTypeID: '_ol_kit_basemap'
}

export default connectToMap(BasemapContainer)
