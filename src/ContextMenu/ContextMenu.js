import React from 'react'
import PropTypes from 'prop-types'
import debounce from 'lodash.debounce'

import { connectToMap, convertXYtoLatLong } from 'Map'
import ContextMenuCoordinateGroup from './ContextMenuCoords'

import { Container } from './styled'

/** A context menu component useful for contextual geospatial actions
 * @component
 * @category ContextMenu
 * @since 0.15.0
 */
class ContextMenu extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      show: false,
      showSnackbar: false,
      pixel: { x: 0, y: 0 }
    }

    // debounce time was changed from 400 to 50 due to innacurate pointer/coords location
    this.pointerMoveHandler = debounce(this.pointerMoveHandler, 50)
  }

  componentDidMount () {
    const { map } = this.props

    // bind to right click events
    document.addEventListener('contextmenu', this.rightClickHandler)

    // bind to any old click events
    document.addEventListener('click', this.clickHandler)

    // bind to pointer move to get accurate lat/long off of mouse location
    map.on('pointermove', this.pointerMoveHandler)
  }

  componentWillUnmount () {
    const { map } = this.props

    document.removeEventListener('contextmenu', this.rightClickHandler)
    document.removeEventListener('click', this.clickHandler)
    map.un('pointermove', this.pointerMoveHandler)
  }

  pointerMoveHandler = e => {
    if (!e.dragging) this.setState({ pointerX: e.pixel[0], pointerY: e.pixel[1] })
  }

  clickHandler = e => {
    // if not within the map, another menu handles the event
    if (!this.isWithinMap(e)) return

    this.setState({ show: false })
  }

  isWithinMap = e => {
    const { map } = this.props
    const rect = map.getTargetElement().getBoundingClientRect()

    return e.x >= rect.left && e.x <= rect.right &&
      e.y >= rect.top && e.y <= rect.bottom
  }

  rightClickHandler = e => {
    const { map } = this.props
    const { pointerX, pointerY } = this.state

    // if we're not within the map, another context menu will handle or if we're not on a canvas we ignore event
    if (!this.isWithinMap(e) || e.target.tagName !== 'CANVAS') return

    // prevent the default browser context menu from showing
    e.preventDefault()

    // get the latitude/longitude
    const { latitude: lat, longitude: long } = convertXYtoLatLong(map, pointerX, pointerY)

    // get any features at the event location (in OL v4 no features returns null which is bad; switch to empty array)
    const features = map.getFeaturesAtPixel([pointerX, pointerY]) || []

    this.setState({ show: true, features, pixel: { x: e.x, y: e.y }, coords: { lat, long } })
  }

  closeContextMenu = msg => {
    this.setState({
      show: false,
      showSnackbar: !!msg, // only show snackbar if there's a message passed
      snackbarMessage: msg
    })
  }

  onCopy = copiedFeatures => {
    this.setState({ copiedFeatures })
  }

  render () {
    const { children, map, keepDefaults } = this.props
    const { show, pixel, features, coords } = this.state

    // we render children if passed; otherwise, we default to a helpful context menu
    const getChildren = () => {
      const props = { map, pixel, coords, features, closeContextMenu: this.closeContextMenu }
      const defaults = [
        <ContextMenuCoordinateGroup key={'coordgroup'} {...props} />
      ]
      // this logic allows defaults, custom or a mix (defaults render on top & custom below)
      const contents = children ? [...(keepDefaults ? defaults : []), ...children] : defaults

      return React.Children.map(contents, c => React.cloneElement(c, props))
    }

    return (
      <React.Fragment>
        <Container
          show={show}
          top={pixel.y}
          left={pixel.x}
          innerRef={node => { this.contextMenuRef = node }}>
          {show && getChildren()}
        </Container>
      </React.Fragment>
    )
  }
}

ContextMenu.propTypes = {
  /** A map which is used to compute the click location */
  map: PropTypes.object.isRequired,

  /** A set of components (like `ContextMenuCoords` or custom items made with `ContextMenuListItem`) which perform actions when clicked */
  children: PropTypes.node,

  /** A client created by a call to `createClient()` using @monsantoit/preferences-client used by ContextMenuHomeLocation */
  preferences: PropTypes.object,

  /** A boolean to indicate if the context menu should show during a draw session */
  disableDuringDraw: PropTypes.bool,

  /** A boolean to indicate if the default context menu items should be left and custom items appended only */
  keepDefaults: PropTypes.bool
}

ContextMenu.defaultProps = {
  disableDuringDraw: true,
  keepDefaults: false
}

export default connectToMap(ContextMenu)
