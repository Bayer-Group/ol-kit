import Clipboard from 'clipboard'
import React from 'react'
import PropTypes from 'prop-types'
import { connectToMap } from 'Map'

import { CoordWrapper, CoordGroup, CoordTitle, CoordRaw } from './styled'

class ContextMenuCoords extends React.PureComponent {
  componentDidMount () {
    const { closeContextMenu, coords, translations } = this.props
    const clipboard = new Clipboard('#coordCopier', {
      text: this.copyCoords
    })

    clipboard.on('success', () => {
      // cleanup clipboard events when we're done
      clipboard.destroy()

      // close the context menu and show a friendly message
      closeContextMenu(`${translations['copied.copied']} "${coords.lat}, ${coords.long}" ${translations['copied.toClipboard']}`)
    })
  }

  copyCoords = () => {
    const { coords } = this.props

    return `${coords.lat}, ${coords.long}`
  }

  renderCoord (text, coord) {
    return (
      <CoordGroup>
        <CoordTitle>{text}</CoordTitle><CoordRaw>{coord}</CoordRaw>
      </CoordGroup>
    )
  }

  render () {
    const { coords, translations } = this.props
    const latDisplay = this.renderCoord(translations['_ol_kit_.ContextMenuCoords.lat'], coords.lat)
    const longDisplay = this.renderCoord(translations['_ol_kit_.ContextMenuCoords.long'], coords.long)

    return (
      <CoordWrapper id='coordCopier'>
        {latDisplay}
        {longDisplay}
      </CoordWrapper>
    )
  }
}

ContextMenuCoords.propTypes = {
  /** A map which is passed through to the handler function (passed automatically by ContextMenu) */
  map: PropTypes.object.isRequired,

  /** The pixel location of the click (passed automatically by ContextMenu) */
  pixel: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  }).isRequired,

  /** The coords of the click (passed automatically by ContextMenu) */
  coords: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    long: PropTypes.number.isRequired
  }).isRequired,

  /** The features at the location of the click (passed automatically by ContextMenu) */
  features: PropTypes.array.isRequired,

  /** A function which called when the context menu item is finished */
  closeContextMenu: PropTypes.func.isRequired,

  translations: PropTypes.object
}

ContextMenuCoords.defaultProps = {
  translations: {
    '_ol_kit_.ContextMenuCoords.lat': 'latitude',
    '_ol_kit_.ContextMenuCoords.long': 'longitude'
  }
}

export default connectToMap(ContextMenuCoords)
