import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import olInteractionDraw from 'ol/interaction/draw'

import { connectToMap } from 'Map'
import PopupBase from './PopupBase'
import PopupDefaultInsert from './PopupInsert/PopupDefaultInsert'
import { addMovementListener, getLayersAndFeaturesForEvent, getPopupPositionFromFeatures, removeMovementListener } from './utils'

/**
 * @component
 * @category Popup
 * @since 0.2.0
 */
class Popup extends Component {
  constructor (props) {
    super(props)

    this.state = {
      clickCoordinate: [0, 0],
      clickPixel: [0, 0],
      features: [],
      loading: false,
      popupPosition: {
        arrow: 'none',
        fits: false,
        pixel: [0, 0]
      },
      show: false
    }

    this.timer = 0
    this.isDoubleClick = false
    this.defaultState = this.state
  }

  componentDidMount () {
    const { map } = this.props

    // bind to map click events
    map.on('click', this.mapClickHandler)
    map.on('dblclick', this.mapDoubleClickHandler)
  }

  componentWillUnmount () {
    const { map } = this.props

    map.un('click', this.mapClickHandler)
    map.un('dblclick', this.mapDoubleClickHandler)
  }

  mapDoubleClickHandler = () => {
    clearTimeout(this.timer)
    this.isDoubleClick = true
    this.hidePopup()
  }

  mapClickHandler = e => {
    this.timer = setTimeout(() => {
      if (!this.isDoubleClick) {
        // Get the interactions from the map as an array.
        const interactions = e.map.getInteractions().getArray()

        // This checks to see if there is an active Draw interaction on the map and prevents the popup showing if it returns true.
        if (interactions.find((i) => i instanceof olInteractionDraw && i.get('active'))) return this.hidePopup()
        this.checkForFeaturesAtClick(e)
      }
      this.isDoubleClick = false
    }, 300)
  }

  checkForFeaturesAtClick = e => {
    const { map } = this.props
    /**
      this util returns an array of promises for each layer at the click location that resolve once wms features
      are converted to wfs and adds them to the map (immediately resolves for features already on the map)
    */
    const promises = getLayersAndFeaturesForEvent(e)

    // cancel if no layers at click location
    // do not add map movement listener or get features from layers
    if (!promises.length) return this.hidePopup()

    // when the map is panned, we need to re-calculate the position of the popup
    const popupMoveHandler = () => {
      const { show, features, popupPosition: lastPosition } = this.state
      const opts = { lastPosition } // use current position as lastPosition for animation when moving map

      // only compute new positions if the popup is showing
      if (show) {
        // this util returns a position object that is used by the popup component in render()
        const popupPosition = getPopupPositionFromFeatures({ map }, features, opts)

        this.setState({ popupPosition })
      }
    }

    // this adds three listeners (map move, resize, zoom), all of which should re-position the popup
    this.movementListener = addMovementListener(map, popupMoveHandler)
    // parse promises for layers and features
    this.getNewFeatures(e, promises)
  }

  getNewFeatures = async (e, promises) => {
    const { onMapClick } = this.props
    const popupPositionWhileLoading = getPopupPositionFromFeatures(e)

    // show popup in loading state while before resolving
    this.setState({
      clickCoordinate: e.coordinate,
      clickPixel: e.pixel,
      loading: true,
      popupPosition: popupPositionWhileLoading,
      show: true
    }, () => onMapClick(this.state))

    const layers = await Promise.all(promises)
    const parsedFeatures = layers.reduce((acc, { features }) => {
      return [...acc, ...features]
    }, [])

    // ol returns these in reverse z-index order
    const features = parsedFeatures.reverse()
    const popupPosition = getPopupPositionFromFeatures(e, features)

    this.setState({ features, loading: false, popupPosition }, () => onMapClick(this.state))
  }

  hidePopup = () => {
    const { onMapClick } = this.props

    // stop tracking movement when popup show is set to false
    this.movementListener && removeMovementListener(this.movementListener)

    this.setState({ ...this.defaultState }, () => onMapClick(this.state))
  }

  onDragEnd = e => {
    // if drag occurs in PopupBase, update pixel in state here
    this.setState({
      popupPosition: {
        ...this.state.popupPosition,
        pixel: e.pinnedPixel
      }
    })
  }

  render () {
    const { actions, children, map, show: propShow } = this.props
    const { features, loading, popupPosition: { arrow, pixel }, show: stateShow } = this.state
    const show = typeof propShow === 'boolean' ? propShow : stateShow // keep show prop as source of truth over state

    return (
      !show
        ? null
        : (
          ReactDOM.createPortal(
            <PopupBase arrow={arrow} onPopupDragEnd={this.onDragEnd} pixel={pixel} {...this.props} show={show}>
              {children || ( // default ui if no children are passed
                <PopupDefaultInsert
                  actions={actions}
                  features={features}
                  loading={loading}
                  onClose={this.hidePopup} />
              )}
            </PopupBase>,
            map.getTargetElement()
          )
        )
    )
  }
}

Popup.defaultProps = {
  onMapClick: () => {},
  show: undefined
}

Popup.propTypes = {
  /** components passed to PopupDefaultInsert to render as actions */
  actions: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  /** Pass components as children of Popup component */
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  /** a reference to openlayers map object */
  map: PropTypes.object.isRequired,
  /** callback fired on map clicks with state object:
    {
      clickCoordinate: [0, 0],
      clickPixel: [0, 0],
      features: [],
      loading: false, // true after click before layers/features load
      popupPosition: {
        arrow: 'none',
        fits: true, // does the popup have room to render around the feature bbox
        pixel: [0, 0]
      },
      show: false // suggestion to display or hide popup -- <Popup show={sourceOfTruth}> (show prop takes priority)
    }
  */
  onMapClick: PropTypes.func,
  /** boolean that is respected over internal state */
  show: PropTypes.bool
}

export default connectToMap(Popup)
