import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { connectToContext } from 'Provider'
import { PopupActionItem } from 'Popup'
import en from 'locales/en'
import { copyWktToClipbard } from './utils'
import { Snackbar } from 'Snackbar'

/**
 * Popup action item to copy geometry as WKT to clipboard
 * @component
 * @category PopupActionCopyWkt
 */
const PopupActionCopyWkt = ({ feature, translations, decimalPlaces = 5 }) => {
  const [showSnackbar, setShowSnackbar] = useState(false)

  const onCopyWktToClipboard = () => {
    setShowSnackbar(true)

    copyWktToClipbard(feature, decimalPlaces)
  }

  return <>
    <PopupActionItem
      title={translations['_ol_kit.PopupActionWkt.copyToClipboard']}
      onClick={() => onCopyWktToClipboard()} />
    <Snackbar
      open={showSnackbar}
      closeSnackbar={() => setShowSnackbar(false)}
      duration={5000}
      message={'Wkt copied to clipboard!'}
      variant='info'/>
  </>
}

PopupActionCopyWkt.propTypes = {
  /** The number of decimal places in the output WKT coords */
  decimalPlaces: PropTypes.number,

  /** The OpenLayers feature of the current popup page */
  feature: PropTypes.object,

  /** Callback to close Popup */
  onClose: PropTypes.func,

  /** Object with key/value pairs for translated strings */
  translations: PropTypes.shape({
    '_ol_kit.PopupActionWkt.copyToClipboard': PropTypes.string
  }).isRequired
}

PopupActionCopyWkt.defaultProps = {
  translations: en
}

export default connectToContext(PopupActionCopyWkt)
