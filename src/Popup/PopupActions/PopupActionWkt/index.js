import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { connectToMap } from 'Map'
import PopupActionItem from './../../PopupInsert/PopupActionItem'

import wktFormat from 'ol/format/wkt'

/**
 * @component
 * @category Popup
 * @example ./example.md
 */
class PopupActionItemWkt extends Component {
  outputWkt = () => {
    const { feature } = this.props
    const format = new wktFormat()
    const output = format.writeFeature(feature, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857'
    })
    
    console.log(output)
    //copyToClipboard(output)
  }

  render () {
    const { translations } = this.props
    
    return (
      <PopupActionItem
        title={translations['_ol_kit.PopupActionWkt.copyToClipboard']}
        onClick={this.outputWkt} />
    )
  }
}

PopupActionItemWkt.propTypes = {
  /** Object with key/value pairs for translated strings */
  translations: PropTypes.object,

  /** The OpenLayers feature of the current popup page */
  feature: PropTypes.object
}

export default connectToMap(PopupActionItemWkt)
