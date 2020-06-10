import React from 'react'
import PropTypes from 'prop-types'

import { connectToContext } from 'Provider'
import { PopupActionItem } from 'Popup'

import { copyWktToClipbard } from './utils'

/**
 * Popup action item to copy geometry as WKT to clipboard
 * @component
 * @category PopupActionCopyWkt
 */
const PopupActionCopyWkt = ({ feature, translations, decimalPlaces = 5 }) => (
  <PopupActionItem
    title={translations['_ol_kit.PopupActionWkt.copyToClipboard']}
    onClick={() => copyWktToClipbard(feature, decimalPlaces)} />
)

PopupActionCopyWkt.propTypes = {
  /** The number of decimal places in the output WKT coords */
  decimalPlaces: PropTypes.number,

  /** The OpenLayers feature of the current popup page */
  feature: PropTypes.object,
  
  /** Object with key/value pairs for translated strings */
  translations: PropTypes.shape({
    '_ol_kit.PopupActionWkt.copyToClipboard': PropTypes.string
  }).isRequired
}

export default connectToContext(PopupActionCopyWkt)
