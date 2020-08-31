import React from 'react'
import PropTypes from 'prop-types'
import { Container, ButtonContainer } from './styled'
import Line from './Line'
import Box from './Box'
import Circle from './Circle'
import Point from './Point'
import Polygon from './Polygon'
import Freehand from './Freehand'
import { DrawToolbar } from 'DrawToolbar'
import olFeature from 'ol/feature'
import olDrawInteraction from 'ol/interaction/draw'
import olSnapInteraction from 'ol/interaction/snap'
import olGeomTypes from 'ol/geom/geometrytype'
import olLayerVector from 'ol/layer/vector'
import olSourceVector from 'ol/source/vector'
import olGeomCircle from 'ol/geom/circle'
import olGeomPolygon from 'ol/geom/polygon'
import olCollection from 'ol/collection'
import { connectToMap } from 'Map'
import { getStyledFeatures } from './utils'

const OL_DRAW_TYPES = [...Object.values(olGeomTypes)]

/**
 * @component
 * @category vmc
 */
class Draw extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      type: '',
      freehand: false,
      feature: null,
      interactions: []
    }
    this.escFunction = this.escFunction.bind(this)
  }

  componentDidMount () {
    const { selectInteraction } = this.props

    if (selectInteraction) {
      selectInteraction.on('select', this.selectListener)
      this.setState({ feature: selectInteraction.getFeatures().getArray()[0] })
    }
    document.addEventListener('keydown', this.escFunction, false)
  }

  componentWillUnmount () {
    const { selectInteraction } = this.props
    const { interactions } = this.state

    if (selectInteraction) selectInteraction.un('select', this.selectListener)
    if (interactions && Array.isArray(interactions) && interactions.length) this.handleDrawCancel()
    document.removeEventListener('keydown', this.escFunction, false)
  }

  escFunction (event) {
    if (event.keyCode === 27) { // esc key
      this.handleDrawCancel()
    }
  }
  selectListener = ({ selected }) => {
    this.setState({ feature: selected[0] })
    this.props.selectedFeature(selected[0])
  }

  addInteraction = (opts) => {
    const { type, freehand, geometryFunction } = opts
    const { map, source, drawOpts, onInteractionAdded, preferences, getStyledFeatures } = this.props
    const { interactions } = this.state

    // if there's an existing interaction, cancel before we start a new one
    if (Array.isArray(interactions) && interactions.length) this.handleDrawCancel()
    if (!type) throw new Error('Needs a valid draw type')
    if (!OL_DRAW_TYPES.includes(type)) throw new Error(`${type} is not a valid draw type`)

    // construct the interaction parameters from the source and the optional draw options provideed from props and the arguments
    const drawInteractionOpts = { source, stopClick: true, ...drawOpts, ...opts }
    const drawInteraction = new olDrawInteraction(drawInteractionOpts)
    const newInteractions = [drawInteraction]
    const snap = preferences ? preferences.get?.('_SNAPPING_ENABLED') : this.props.snap

    // if snap prop is true (default is true) create and push a snap interaction to the interactions array
    if (snap) {
      const snapOpts = preferences ? { pixelTolerance: preferences.get?.('_SNAPPING_TOLERANCE') } : this.props.snapOpts
      const mapLayers = map.getLayers().getArray()
      const res = map.getView().getResolution()
      const vectorLayers = mapLayers.filter(layer => layer instanceof olLayerVector)
      const snapFeatures = new olCollection(getStyledFeatures(vectorLayers, res).map(([feature]) => feature))
      const snapInteractionOpts = { features: snapFeatures, ...snapOpts }
      const snapInteraction = new olSnapInteraction(snapInteractionOpts)

      newInteractions.push(snapInteraction)
    }
    drawInteraction.on('drawstart', this.handleInteractionEvent)
    drawInteraction.on('drawend', this.handleInteractionEvent)

    // store some draw state and then add the interactions to the map
    this.setState(
      { interactions: newInteractions, type, freehand, geometryFunction },
      () => {
        this.state.interactions.forEach(interaction => map.addInteraction(interaction))
        // callback function for implementors
        onInteractionAdded(drawInteraction)
      }
    )
  }

  handleInteractionEvent = (event) => {
    const { onDrawBegin } = this.props
    const { type, feature } = event

    switch (type) {
      case 'drawstart':
        this.setState({ feature })

        return onDrawBegin(feature, event)
      case 'drawend':
        return this.handleDrawFinish(feature, event)
      default:
        return false
    }
  }

  getDrawInteraction = () => {
    const { interactions } = this.state

    return interactions.find(interaction => interaction instanceof olDrawInteraction)
  }

  getSnapInteraction = () => {
    const { interactions } = this.state

    return interactions.find(interaction => interaction instanceof olSnapInteraction)
  }

  handleDrawFinish = (feature) => {
    const { onDrawFinish, map } = this.props
    const { interactions } = this.state

    // we only have a feature when the draw is 'finished' via OL
    // and therefore there is a drawend event with a feature
    const haveFeature = feature instanceof olFeature
    const drawInteraction = this.getDrawInteraction()

    // if we don't have a featue (user hit the DOM finish button)
    // finish the drawing (this will trigger the drawend event)
    if (drawInteraction && !haveFeature) drawInteraction.finishDrawing()

    interactions.forEach(interaction => map.removeInteraction(interaction))
    this.setState({ interactions: [], type: null, measureFeature: null })
    const geom = feature.getGeometry()
    const geomIsCircle = geom instanceof olGeomCircle

    if (geomIsCircle) {
      const circleGeom = olGeomPolygon.fromCircle(geom, 180)

      feature.setGeometry(circleGeom)
    }
    onDrawFinish(feature)
  }

  handleDrawCancel = () => {
    const { source, map, onDrawCancel } = this.props
    const { interactions } = this.state
    const drawInteraction = this.getDrawInteraction()

    try {
      // unbind drawend (otherwise this gets fired by finishDrawing on the next line)
      drawInteraction.un('drawend', this.handleInteractionEvent)
      // now we can safely 'finish' the draw interaction (with no events fired)
      drawInteraction.finishDrawing()
      // now we remove the feature which was just added b/c we 'finished it'
      source.removeFeature(source.getFeatures().pop())
    } catch (e) {
      console.warn(`Openlayers was unable to finish the drawing due to`, e) // eslint-disable-line
    }
    interactions.forEach(interaction => map.removeInteraction(interaction))

    // callback function for implementors
    onDrawCancel(drawInteraction)
    this.setState({ interactions: [], type: null, feature: null })
  }

  render () {
    const { type, freehand, geometryFunction, interactions } = this.state
    const { translations } = this.props

    return (
      <div data-testid='Draw.container'>
        {this.props.children
          ? React.Children.map(this.props.children, child => {
            return React.cloneElement(child, { addInteraction: this.addInteraction, type, freehand, geometryFunction })
          })
          : <Container>
            <ButtonContainer>
              <Point addInteraction={this.addInteraction} type={type}
                tooltipTitle={translations['_ol_kit.draw.pointTooltip']} />
              <Line addInteraction={this.addInteraction} type={type}
                freehand={freehand} tooltipTitle={translations['_ol_kit.draw.lineTooltip']} />
              <Polygon addInteraction={this.addInteraction} type={type}
                tooltipTitle={translations['_ol_kit.draw.polygonTooltip']} />
              <Circle addInteraction={this.addInteraction} type={type}
                geometryFunction={geometryFunction} tooltipTitle={translations['_ol_kit.draw.circleTooltip']} />
              <Box addInteraction={this.addInteraction} type={type}
                geometryFunction={geometryFunction} tooltipTitle={translations['_ol_kit.draw.boxTooltip']} />
              <Freehand addInteraction={this.addInteraction} type={type} freehand={freehand}
                tooltipTitle={translations['_ol_kit.draw.freehandTooltip']} />
            </ButtonContainer>
          </Container>}
        {
          Array.isArray(interactions) && interactions.length && (<DrawToolbar onFinish={this.handleDrawFinish} onCancel={this.handleDrawCancel} />)
        }
      </div>
    )
  }
}

Draw.propTypes = {
  /** openlayers map */
  map: PropTypes.object.isRequired,

  /** openlayers layersource */
  source: PropTypes.object,

  /** callback that's called when the feature's draw is completed and returns an openlayers feature */
  onDrawFinish: PropTypes.func,

  /** callback that's called when the feature's draw is started and returns an openlayers feature */
  onDrawBegin: PropTypes.func,

  /** callback that's called when the draw button icon is clicked and adds a openlayers draw interaction */
  onInteractionAdded: PropTypes.func,

  /** callback that's called when the feature's draw is canceled */
  onDrawCancel: PropTypes.func,

  /** openlayers draw interaction constructor props */
  drawOpts: PropTypes.object,

  /** pheonix translations object */
  translations: PropTypes.object,

  /** reference to openlayers select interaction which can optionally be managed by IA */
  selectInteraction: PropTypes.object,

  /** callback that returns the selected openlayers feature from the map */
  selectedFeature: PropTypes.func,

  /** openlayers snap opts object */
  snapOpts: PropTypes.object,

  /** boolean for enabling snap interaction */
  snap: PropTypes.bool,

  /** function to retrieve openlayers features and their styles */
  getStyledFeatures: PropTypes.func,

  /** The buttons passed to the Draw container */
  children: PropTypes.node,

  /* A preferences object */
  preferences: PropTypes.object
}

Draw.defaultProps = {
  translations: {
    '_ol_kit.Measurement.distance': 'Distance: ',
    '_ol_kit.Measurement.area': 'Area: ',
    '_ol_kit.units.feet': 'Feet',
    '_ol_kit.units.yards': 'Yards',
    '_ol_kit.units.miles': 'Miles',
    '_ol_kit.units.acres': 'Acres',
    '_ol_kit.units.nauticalmiles': 'Nautical miles',
    '_ol_kit.units.meters': 'Meters',
    '_ol_kit.units.kilometers': 'Kilometers',
    '_ol_kit.units.hectares': 'Hectares',
    '_ol_kit.draw.pointTooltip': 'Point',
    '_ol_kit.draw.lineTooltip': 'Line',
    '_ol_kit.draw.polygonTooltip': 'Polygon',
    '_ol_kit.draw.circleTooltip': 'Circle',
    '_ol_kit.draw.boxTooltip': 'Box',
    '_ol_kit.draw.freehandTooltip': 'Freehand'
  },
  getStyledFeatures,
  drawOpts: {},
  source: new olSourceVector(),
  snapOpts: {},
  snap: true,
  onDrawFinish: () => {},
  onDrawBegin: () => {},
  onInteractionAdded: () => {},
  onDrawCancel: () => {}
}

export default connectToMap(Draw)
