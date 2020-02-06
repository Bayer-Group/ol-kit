import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Container, ButtonContainer } from './styled'
import Line from './Line'
import Box from './Box'
import Circle from './Circle'
import Point from './Point'
import Polygon from './Polygon'
import Freehand from './Freehand'
import Toolbar from './Toolbar'
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
import { getStyledFeatures } from './utils.js'

const OL_DRAW_TYPES = [...Object.values(olGeomTypes)]

class Draw extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      type: '',
      freehand: false,
      feature: null,
      interactions: []
    }
  }

  componentDidMount () {
    const { selectInteraction } = this.props

    if (selectInteraction) {
      selectInteraction.on('select', this.selectListener)
      this.setState({ feature: selectInteraction.getFeatures().getArray()[0] })
    }
  }

  componentWillUnmount () {
    const { selectInteraction } = this.props
    const { interactions } = this.state

    if (selectInteraction) selectInteraction.un('select', this.selectListener)
    if (interactions && Array.isArray(interactions) && interactions.length) this.handleDrawCancel()
  }

  selectListener = ({ selected }) => {
    this.setState({ feature: selected[0] })
    this.props.selectedFeature(selected[0])
  }

  addInteraction = (opts) => {
    const { type, freehand, geometryFunction } = opts
    const { map, source, drawOpts, onInteractionAdded, snapOpts, snap, getStyledFeaturesFunction } = this.props
    const { interactions } = this.state

    // if there's an existing interaction, cancel before we start a new one
    if (Array.isArray(interactions) && interactions.length) this.handleDrawCancel()
    if (!type) throw new Error('Needs a valid draw type')
    if (!OL_DRAW_TYPES.includes(type)) throw new Error(`${type} is not a valid draw type`)

    // construct the interaction parameters from the source and the optional draw options provideed from props and the arguments
    const drawInteractionOpts = { source, stopClick: true, ...drawOpts, ...opts }
    const drawInteraction = new olDrawInteraction(drawInteractionOpts)
    const newInteractions = [drawInteraction]

    // if snap prop is true (default is true) create and push a snap interaction to the interactions array
    if (snap) {
      const mapLayers = map.getLayers().getArray()
      const res = map.getView().getResolution()
      const vectorLayers = mapLayers.filter(layer => layer instanceof olLayerVector)
      const snapFeatures = new olCollection(getStyledFeaturesFunction(vectorLayers, res).map(([feature]) => feature))
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

  handleInteractionEvent = ({ type, feature }) => {
    const { onDrawBegin } = this.props

    switch (type) {
      case 'drawstart':
        this.setState({ feature })

        return onDrawBegin(feature)
      case 'drawend':
        return this.handleDrawFinish(feature)
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

    // we only have a feature when the draw is "finished" via OL
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
      // now we can safely "finish" the draw interaction (with no events fired)
      drawInteraction.finishDrawing()
      // now we remove the feature which was just added b/c we "finished it"
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
      <Fragment>
        {this.props.children
          ? React.Children.map(this.props.children, child => {
            return React.cloneElement(child, { addInteraction: this.addInteraction, type, freehand, geometryFunction })
          })
          : <Container>
            <ButtonContainer>
              <Point addInteraction={this.addInteraction} type={type}
                tooltipTitle={translations['draw.pointTooltip']} />
              <Line addInteraction={this.addInteraction} type={type}
                freehand={freehand} tooltipTitle={translations['draw.lineTooltip']} />
              <Polygon addInteraction={this.addInteraction} type={type}
                tooltipTitle={translations['draw.polygonTooltip']} />
              <Circle addInteraction={this.addInteraction} type={type}
                geometryFunction={geometryFunction} tooltipTitle={translations['draw.circleTooltip']} />
              <Box addInteraction={this.addInteraction} type={type}
                geometryFunction={geometryFunction} tooltipTitle={translations['draw.boxTooltip']} />
              <Freehand addInteraction={this.addInteraction} type={type} freehand={freehand}
                tooltipTitle={translations['draw.freehandTooltip']} />
            </ButtonContainer>
          </Container>}
        {
          Array.isArray(interactions) && interactions.length
            ? (<Toolbar onFinish={this.handleDrawFinish} onCancel={this.handleDrawCancel} />)
            : null
        }
      </Fragment>
    )
  }
}

Draw.propTypes = {
  /** openlayers map */
  map: PropTypes.object,

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
  getStyledFeaturesFunction: PropTypes.func,

  /** The buttons passed to the Draw container */
  children: PropTypes.node
}

Draw.defaultProps = {
  translations: {
    'Measurement.distance': 'Distance: ',
    'Measurement.area': 'Area: ',
    'units.feet': 'Feet',
    'units.yards': 'Yards',
    'units.miles': 'Miles',
    'units.acres': 'Acres',
    'units.meters': 'Meters',
    'units.kilometers': 'Kilometers',
    'units.hectares': 'Hectares',
    'draw.pointTooltip': 'tooltip',
    'draw.lineTooltip': 'tooltip',
    'draw.polygonTooltip': 'tooltip',
    'draw.circleTooltip': 'tooltip',
    'draw.boxTooltip': 'tooltip',
    'draw.freehandTooltip': 'tooltip'
  },
  drawOpts: {},
  source: new olSourceVector(),
  snapOpts: {},
  snap: true,
  onDrawFinish: () => {},
  onDrawBegin: () => {},
  onInteractionAdded: () => {},
  onDrawCancel: () => {},
  getStyledFeaturesFunction: getStyledFeatures
}

export default connectToMap(Draw)
