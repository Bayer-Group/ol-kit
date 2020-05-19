import React from 'react'
import PropTypes from 'prop-types'

import { connectToMap } from 'Map'
import PopupActionItem from 'Popup/PopupInsert/PopupActionItem'

import { copyWktToClipbard } from './utils'

/**
 * @component
 * @category PopupActions
 */
const PopupActionCopyWkt = ({ feature, translations, decimalPlaces = 5 }) => (
  <PopupActionItem
    title={translations['_ol_kit.PopupActionWkt.copyToClipboard']}
    onClick={() => copyWktToClipbard(feature, decimalPlaces)} />
)

PopupActionCopyWkt.propTypes = {
  /** Object with key/value pairs for translated strings */
  translations: PropTypes.shape({
    '_ol_kit.PopupActionWkt.copyToClipboard': PropTypes.string
  }).isRequired,

  /** The OpenLayers feature of the current popup page */
  feature: PropTypes.object,

  /** The number of decimal places in the output WKT coords */
  decimalPlaces: PropTypes.number
}

export default connectToMap(PopupActionCopyWkt)
