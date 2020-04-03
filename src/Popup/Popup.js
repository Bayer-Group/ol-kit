import React, { Component } from 'react'
import PropTypes from 'prop-types'
import olInteractionDraw from 'ol/interaction/draw'

import { connectToMap } from 'Map'
import PopupBase from './PopupBase'
import PopupInsertDefault from './PopupInsert/PopupInsertDefault'
import { addMovementListener, getLayersAndFeaturesForEvent, getPopupPositionFromFeatures, removeMovementListener } from './utils'

/**
 * @component
 * @category Popup
 * @since 0.1.0
 */
class Popup extends Component {
  constructor (props) {
    super(props)

    this.state = {
      features: [],
      loading: false,
      popupPosition: {
        arrow: 'none',
        fits: false,
        pixel: [0, 0]
      },
      show: false
    }
  }

  componentDidMount () {
    const { map } = this.props

    // bind to map click events
    map.on('click', this.mapClickHandler)
  }

  componentWillUnmount () {
    const { map } = this.props

    map.un('click', this.mapClickHandler)
    removeMovementListener(this.movementListener) // TODO this needs to move to whenever popup show is false
  }

  mapClickHandler = e => {
    // hide every map click and reshow if layers are detected
    this.hidePopup()

    // Get the interactions from the map as an array.
    const interactions = e.map.getInteractions().getArray()

    // This checks to see if there is an active Draw interaction on the map and prevents the popup showing if it returns true.
    if (interactions.find((i) => i instanceof olInteractionDraw && i.get('active'))) return

    this.checkForFeaturesAtClick(e)
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
    if (!promises.length) return

    // when the map is panned, we need to re-calculate the position of the popup
    const popupMoveHandler = () => {
      const { show, features, popupPosition: lastPosition } = this.state
      const opts = { lastPosition } // use current position as lastPosition for animation

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
    const { featuresFilter, onMapClick } = this.props // eslint-disable-line no-unused-vars

    // show popup in loading state while before resolving
    this.setState({ show: true, loading: true }, () => onMapClick(this.state))

    const layers = await Promise.all(promises)

    const features = layers.reduce((acc, { features, layer }) => {
      const layerFeatures = features.map(feature => {
        feature.set('_ol_kit_parent', layer)

        return feature
      })

      return [...acc, ...layerFeatures]
    }, [])
    // ol returns these in reverse z-index order
    .reverse() // eslint-disable-line indent
    .featuresFilter() // eslint-disable-line indent

    const popupPosition = getPopupPositionFromFeatures(e, features)

    this.setState({ features, loading: false, popupPosition }, () => onMapClick(this.state))
  }

  hidePopup = () => {
    const { map, onMapClick } = this.props
    const popupPosition = getPopupPositionFromFeatures({ map }, [])

    this.setState({ features: [], popupPosition, show: false }, () => onMapClick(this.state))
  }

  render () {
    const { children } = this.props
    const { features, loading, popupPosition: { arrow, pixel }, show } = this.state

    // spread props to keep show prop as source of truth over state
    return (
      <PopupBase show={show} pixel={pixel} arrow={arrow} {...this.props}>
        {children || (
          <PopupInsertDefault
            features={features}
            loading={loading}
            onClose={this.hidePopup}
            {...this.props} /> // default ui if no children are passed
        )}
      </PopupBase>
    )
  }
}

Popup.defaultProps = {
  featuresFilter: features => features,
  onMapClick: () => {},
  show: undefined // TODO this might need to be null -- write a test!
}

Popup.propTypes = {
  /** Pass components as children of Popup component */
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  /** return a filtered array of features */
  featuresFilter: PropTypes.func,
  /** a reference to openlayers map object */
  map: PropTypes.object.isRequired,
  /** callback fired on map clicks with state object:
    {
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
