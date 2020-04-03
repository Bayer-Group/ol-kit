import React, { Component } from 'react'
import PropTypes from 'prop-types'
import olSelect from 'ol/interaction/select'
import olStyle from 'ol/style/style'
import olStroke from 'ol/style/stroke'
import olCircle from 'ol/style/circle'
import olFill from 'ol/style/fill'
import olInteractionDraw from 'ol/interaction/draw'

import { connectToMap } from 'Map'
import PopupShell from './PopupShell'
import { addMovementListener, getLayersAndFeaturesForEvent, getPopupPositionFromFeatures } from './utils'

/**
 * @component
 * @category Popup
 */
class Popup extends Component {
  constructor (props) {
    super(props)

    this.state = {
      popupPosition: {
        pixel: [0, 0],
        arrow: 'none'
      },
      loading: false,
      selectedIdx: 0,
      features: [],
      showPopup: false
    }
  }

  componentDidMount () {
    const { map } = this.props

    // bind to map click events
    map.on('click', this.mapClickHandler)

    // this style determines how features will look when they are "selected"
    const style = new olStyle({
      stroke: new olStroke({
        color: 'cyan',
        width: 3
      }),
      image: new olCircle({
        radius: 5,
        fill: new olFill({
          color: 'white'
        }),
        stroke: new olStroke({
          color: 'cyan',
          width: 2
        })
      })
    })

    // check for select interaction passed as a prop
    if (this.props.selectInteraction) {
      this.selectInteraction = this.props.selectInteraction
    } else {
      this.selectInteraction = new olSelect({
        hitTolerance: 3,
        style: [style],
        removeCondition: () => true // removes ol's selection action
      })
      map.addInteraction(this.selectInteraction)
    }

    // when the map is panned, we need to re-calculate the position of the popup
    const popupMoveHandler = () => {
      const { showPopup, features, popupPosition } = this.state
      const opts = { lastPosition: popupPosition }

      // only compute new positions if the popup is showing
      if (showPopup) {
        // this util returns a position object that is used by the popup component in render()
        const position = getPopupPositionFromFeatures({ map }, features, opts)

        this.setState({ popupPosition: position })
      }
    }

    // this adds three listeners (map move, resize, zoom), all of which should re-position the popup
    addMovementListener(map, popupMoveHandler)
  }

  componentWillUnmount () {
    const { map } = this.props

    map.un('click', this.mapClickHandler)
  }

  mapClickHandler = e => {
    const { onMapClick } = this.props

    // remove previous selection from map, if new feature is selected, it will be added below
    this.selectInteraction.getFeatures().clear()
    // Get the interactions from the map as an array.
    const interactions = e.map.getInteractions().getArray()

    // This checks to see if there is an active Draw interaction on the map and prevents the popup showing if it returns true.
    if (interactions.find((i) => i instanceof olInteractionDraw && i.get('active'))) return
    this.setState({ features: [], selectedIdx: 0, showPopup: false }, () => {
      onMapClick({ features: [], selectedIdx: 0, showPopup: false })
      this.getNewFeatures(e)
    })
  }

  getNewFeatures = async (e) => {
    const { onAnnotationClick, onMapClick } = this.props
    // this util returns an array of promises for each layer at the click location that resolve once wms features are converted to wfs and adds them to the map (immediately resolves for features already on the map)
    // if there were layers (each promise correpsonds to a single layer) at the click location get the best position for the popup
    const proms = getLayersAndFeaturesForEvent(e)

    if (proms.length) {
      const position = getPopupPositionFromFeatures(e, [])

      // set the popup position to state (which is then passed to the popup component)
      this.setState({ popupPosition: position, showPopup: true, loading: true })
      onMapClick({ showPopup: true, loading: true })
    }

    const layers = await Promise.all(proms)

    const cancel = () => {
      this.setState({ features: [], selectedIdx: 0, showPopup: false })
      onMapClick({ showPopup: false, loading: false })
    }

    if (!layers.length) {
      return cancel()
    }

    const layerFeatures = layers.reduce((acc, { features, layer }) => {
      const layerFeatures = features.map((feature) => {
        feature.set('_vmf_layerId', layer.get('_vmf_catalogId'))

        return feature
      })

      return [...acc, ...layerFeatures]
    }, [])

    const [exceptionFeature] = layerFeatures
      .filter((feature) => feature.get('_vmf_type') === '_vmf_annotation' || feature.get('_vmf_type') === '_vmf_icon')
      .reverse() // ol returns these in reverse z-index order

    if (exceptionFeature) {
      onAnnotationClick(exceptionFeature)

      return cancel()
    }

    const newFeatures = layerFeatures.reverse() // ol returns these in reverse z-index order
    const popupPosition = getPopupPositionFromFeatures(e, newFeatures)

    this.setState({ features: newFeatures, loading: false, popupPosition }, () => {
      onMapClick(this.state)

      const [featureToSelect] = this.state.features

      if (featureToSelect) this.selectFeature(featureToSelect)
    })
  }

  UNSAFE_componentWillReceiveProps (nextProps) { // eslint-disable-line camelcase
    if (!!nextProps.selectInteraction && !this.props.selectInteraction) {
      // update the select interaction to use passed prop
      this.selectInteraction = this.props.selectInteraction
    }
    if (nextProps.selectedIdx !== this.props.selectedIdx) {
      // in case they still handle rendering their children and paging features - we need to stay in sync
      this.onPageChange(this.props.selectedIdx, nextProps.selectedIdx)
    }
  }

  selectFeature = feature => {
    const deselected = this.selectInteraction.getFeatures().getArray()
    const selected = [feature]
    const event = new olSelect.Event('select', selected, deselected)

    // clear the previously selected feature before adding newly selected feature so only one feature is "selected" at a time
    this.selectInteraction.getFeatures().clear()
    this.selectInteraction.getFeatures().push(feature)
    this.selectInteraction.dispatchEvent(event)
  }

  render () {
    const { children, show } = this.props
    const { features, loading, showPopup, popupPosition: { arrow, pixel }, selectedIdx } = this.state
    const shouldPopupShow = typeof show === 'boolean' ? show : showPopup // use prop if passed, otherwise use state

    return (
      <PopupShell {...this.props} show={shouldPopupShow} arrow={arrow} pixel={pixel}>
        {children}
      </PopupShell>
    )
  }
}

Popup.defaultProps = {
  onAnnotationClick: () => {},
  onMapClick: () => {}
}

Popup.propTypes = {
  /** Pass components as children of Popup component */
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  /** a reference to openlayers map object */
  map: PropTypes.object.isRequired,
  /** callback fired on map marker & text annotation clicks */
  onAnnotationClick: PropTypes.func,
  /** callback fired on map clicks includes features, loading, selectedIdx, showPopup, & position */
  onMapClick: PropTypes.func,
  /** index of currently selected page in popup */
  selectedIdx: PropTypes.number,
  /** reference to openlayers select interaction which can optionally be managed by IA */
  selectInteraction: PropTypes.object,
  /** boolean that is respected over internal state */
  show: PropTypes.bool
}

export default connectToMap(Popup)
