import React from 'react'
import PropTypes from 'prop-types'
import { Container } from './styled'
import OpenStreetMap from './OpenStreetMap'
import BlankWhite from './BlankWhite'
import StamenTerrain from './StamenTerrain'
import StamenTonerDark from './StamenTonerDark'
import StamenTonerLite from './StamenTonerLite'

const LAYER_TYPE_ID = '_ol_kit_basemap'

/**
 * An easy Basemap switching component with customizable basemap options
 * @component
 * @category Basemap
 * @since 0.1.0
 */
class BasemapManager extends React.Component {
  static getLayerTypeID () {
    return LAYER_TYPE_ID
  }

  render () {
    const { children } = this.props

    return (
      <Container>
        <OpenStreetMap layerTypeID={LAYER_TYPE_ID} />
        <StamenTerrain layerTypeID={LAYER_TYPE_ID} />
        <StamenTonerDark layerTypeID={LAYER_TYPE_ID} />
        <StamenTonerLite layerTypeID={LAYER_TYPE_ID} />
        <BlankWhite layerTypeID={LAYER_TYPE_ID} />
        {children}
      </Container>
    )
  }
}

BasemapManager.propTypes = {
  /** Pass components as children of BasemapManager component */
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  /** Object with key/value pairs for translated strings */
  translations: PropTypes.object
}

export default BasemapManager
