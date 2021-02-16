import React from 'react'
import PropTypes from 'prop-types'
import en from  'locales/en'
import { PopupActionItem } from 'Popup'

import { getCenter } from 'ol/extent'
import { transform } from 'ol/proj'

/**
 * Popup action item to navigate to a feature using google maps
 * @component
 * @category PopupActionNavigate
 */
const PopupActionNavigate = ({ feature, translations }) => {

  const [ long, lat ] = transform(getCenter(feature.getGeometry().getExtent()), 'EPSG:3857', 'EPSG:4326')
  const url = `https://www.google.com/maps/search/?api=1&query=${ lat },${ long }`
  
  return (
    <PopupActionItem
      title={translations['_ol_kit.PopupActionNavigate.navigateHere']}
      href={url} />
  )
}

PopupActionNavigate.propTypes = {
  /** The OpenLayers feature of the current popup page */
  feature: PropTypes.object,

  /** Object with key/value pairs for translated strings */
  translations: PropTypes.shape({
    '_ol_kit.PopupActionNavigate.navigateHere': PropTypes.string
  }).isRequired
}

PopupActionNavigate.defaultProps = {
  translations: en
}

export default PopupActionNavigate