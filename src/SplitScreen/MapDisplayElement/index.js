import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { PrimaryButton, LockIcon } from './styled'

/**
 * @component
 * @category SplitScreen
 */
class MapDisplayElement extends Component {
  render () {
    const { translations, toggleSyncMap, synced, index, grow, disabled, mapNumber } = this.props

    return (
      <PrimaryButton
        grow={grow}
        synced={synced}
        disabled={disabled}
        onClick={toggleSyncMap.bind(this, index)}>
        {disabled
          ? <LockIcon className={'zmdi zmdi-lock'}/>
          : <div>{translations['_ol_kit.MapDisplayElement.map']} {mapNumber}</div>
        }
      </PrimaryButton>
    )
  }
}

MapDisplayElement.propTypes = {
  /** Object with key/value pairs for translated strings */
  translations: PropTypes.object,

  /** Callback function fired when the preview is clicked */
  toggleSyncMap: PropTypes.func,

  /** Determines if the preview should be highlighted to indicate synced state */
  synced: PropTypes.bool,

  /** The index of the map being represented */
  index: PropTypes.number,

  /** Determines if the preview UI should grow to fill width */
  grow: PropTypes.bool,

  /** Determines if the UI should allow clicking on the map preview to toggle syncing */
  disabled: PropTypes.bool,

  /** The number of the map being represented */
  mapNumber: PropTypes.number
}

MapDisplayElement.defaultProps = {
  translations: {
    '_ol_kit.MapDisplayElement.map': 'Map'
  }
}

export default MapDisplayElement
