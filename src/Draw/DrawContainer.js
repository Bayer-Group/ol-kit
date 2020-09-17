import React from 'react'
import PropTypes from 'prop-types'
import nanoid from 'nanoid'
import olLayerVector from 'ol/layer/Vector'
import olSourceVector from 'ol/source/Vector'
import olDrawInteraction from 'ol/interaction/Draw'
import CircularProgress from '@material-ui/core/CircularProgress'
import Draw from './Draw'
import { Measure } from 'Measure'
import { SnapPreference, CoordinateLabelPreference } from 'Preferences'
import { connectToMap } from 'Map'
import { styleMeasure } from './utils'
import { Container, ProgressWrapper } from './styled'

class MockPreferences {
  constructor () {
    this.state = {}
  }

  get (key) {
    return this.state[key]
  }

  async put (key, val) {
    this.state = { ...this.state, [key]: val }

    return val
  }
}

/**
 * A prebuilt Draw Tools component
 * @component
 * @category Draw
 * @since 0.18.0
 */
class DrawContainer extends React.Component {
  constructor () {
    super()

    this.state = {}

    this.onDrawStart = this.onDrawStart.bind(this)
    this.onDrawCancel = this.onDrawCancel.bind(this)
    this.onDrawEnd = this.onDrawEnd.bind(this)
    this.renderMeasure = this.renderMeasure.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
  }

  safeGetPreference = (key) => this.props.preferences?.payload?.get?.(key)

  getUoms = () => {
    const uom = this.safeGetPreference('_UOM') || 'imperial'
    const distanceUOM = this.safeGetPreference('_DISTANCE_LABEL_UOM')
    const areaUOM = this.safeGetPreference('_AREA_LABEL_UOM')

    return {
      uomType: uom,
      distanceUOM: distanceUOM || (uom === 'imperial' ? 'feet' : 'meters'),
      areaUOM: areaUOM || (uom === 'imperial' ? 'acres' : 'hectares')
    }
  }

  updateMeasureStyle = (newValues = this.getUoms()) => {
    const { map } = this.props
    const { feature } = this.state
    const { distanceUOM, areaUOM } = newValues
    const isLegacyMeasure = feature?.get('_vmf_type') === '_vmf_measurement'
    const needsAreaLabels = feature?.get('_ol_kit_area_labels')
    const needsDistanceLabels = feature?.get('_ol_kit_distance_labels')
    const isMeasure = isLegacyMeasure || needsAreaLabels || needsDistanceLabels

    this.setState(newValues)

    if (isMeasure) {
      const styleFunc = styleMeasure.bind(this,
        map,
        feature,
        map.getView().getResolution(),
        { distanceUOM, areaUOM, map })

      feature.setStyle(styleFunc)
    }
  }

  getLayer () {
    const { feature } = this.state
    const title = feature.get('_vmf_type') === '_vmf_measurement' ? 'Measurements Layer' : 'Annotations Layer'
    const layers = this.props.map.getLayers().getArray()
    const exists = layers.find(l => l.get('_vmf_title') === title)

    if (exists) {
      return exists
    } else {
      const layer = new olLayerVector({
        className: `_ol_kit_${title}`,
        _vmf_id: nanoid(),
        _vmf_title: title,
        title: 'Annotations',
        source: new olSourceVector()
      })

      this.props.map.addLayer(layer)

      return layer
    }
  }

  onDrawEnd (feature) {
    console.debug('%cDrawEnd', 'color: cyan; font-style: italic;', feature) // eslint-disable-line

    const layer = this.getLayer()

    layer.getSource().addFeature(feature)
    feature.set('_ol_kit_parent', layer)
    feature.set('_ol_kit_annotation', true)
    feature.set('_vmf_id', nanoid())

    this.setState({ feature: null })
  }

  onDrawStart (feature, { target }) {
    const { distanceUOM, areaUOM } = this.getUoms()
    const pointLabels = this.safeGetPreference('_POINT_LABELS_ENABLED')
    const distanceLabelsEnabled = this.safeGetPreference('_DISTANCE_LABEL_ENABLED')
    const areaLabelsEnabled = this.safeGetPreference('_AREA_LABEL_ENABLED')
    const opts = { distanceUOM, areaUOM, map }
    const isBoxDraw = target.geometryFunction_?.toString() === olDrawInteraction.createBox().toString()
    const drawMode = isBoxDraw ? 'Box' : target.mode_
    const isFreehand = target.freehand_

    if (distanceLabelsEnabled) feature.set('_ol_kit_distance_labels', true)
    if (areaLabelsEnabled) feature.set('_ol_kit_area_labels', true)
    if (pointLabels && !isFreehand) feature.set('_ol_kit_coordinate_labels', true)
    if (drawMode === 'Circle') {
      feature.set('_ol_kit_draw_mode', 'circle')

      if (pointLabels) {
        feature.set('_ol_kit_needs_centroid_label', true)
        feature.set('_ol_kit_coordinate_labels', false) // To prevent all needVertexLabels for running in styles.js
      }
    }
    const styleFunc = distanceLabelsEnabled || areaLabelsEnabled || pointLabels
      ? styleMeasure.bind(this, map, feature, map.getView().getResolution(), opts)
      : undefined

    feature.setStyle(styleFunc)

    this.setState({ feature, drawMode })
    console.debug('%cDrawStart', 'color: magenta; font-style: italic;') // eslint-disable-line
  }

  onInteractionAdded (interaction) {
    console.debug('%cInteractionAdded', 'color: yellow; font-style: italic;', interaction) // eslint-disable-line
  }

  onDrawCancel (interaction) {
    console.debug('%cDrawCancel', 'color: white; background-color: red; border-radius: 4px; font-style: italic;', interaction) // eslint-disable-line
    this.setState({ feature: null })
  }

  handleUomChange = () => {
    this.updateMeasureStyle()
  }

  selectedFeature = (feature) => {
    this.setState({ feature })
    this.props.selectedFeature(feature)
  }

  handleToggle = () => {
    this.forceUpdate()
  }

  renderPreferences = () => {
    const { translations, preferences } = this.props
    const { status, payload } = preferences

    switch (status) {
      case 'loading':
        return (
          <ProgressWrapper key={nanoid()}>
            <CircularProgress color={'primary'} />
          </ProgressWrapper>
        )
      case 'success':
        return (
          <React.Fragment key={'Snap'}>
            <SnapPreference
              translations={translations}
              preferences={payload}
              onChange={this.handleToggle}
              compact={false} />
          </React.Fragment>
        )
      default:
        return null
    }
  }

  renderMeasure = () => {
    const { uom, translations, showCoordinateLabels, preferences, showMeasurements } = this.props

    if (!showMeasurements) return null
    const { feature, geometryType, drawMode } = this.state
    const { status, payload } = preferences

    switch (status) {
      case 'loading':
        return (
          <ProgressWrapper key={nanoid()}>
            <CircularProgress color={'primary'} />
          </ProgressWrapper>
        )
      case 'success':
        return (
          <React.Fragment key={'Measure'}>
            {
              showCoordinateLabels
                ? <CoordinateLabelPreference
                  compact={true}
                  translations={translations}
                  preferences={payload}
                  onChange={this.handleToggle} />
                : null
            }
            <Measure
              {...this.props}
              feature={feature}
              uom={uom || payload?.get?.('_UOM')}
              onUomChange={this.handleUomChange}
              geometryType={geometryType}
              preferences={payload}
              drawMode={drawMode} />
          </React.Fragment>
        )
      default:
        return null
    }
  }

  render () {
    const { preferences, children } = this.props
    const drawChildren = children || [
      this.renderMeasure(),
      <Draw
        {...this.props}
        key={'Draw'}
        preferences={preferences.payload}
        onDrawFinish={this.onDrawEnd}
        onDrawBegin={this.onDrawStart}
        onInteractionAdded={this.onInteractionAdded}
        onDrawCancel={this.onDrawCancel}
        selectInteraction={this.props.selectInteraction} />,
      this.renderPreferences()
    ]

    return (
      <Container>
        {drawChildren}
      </Container>
    )
  }
}

DrawContainer.propTypes = {
  /** openlayers map */
  map: PropTypes.object.isRequired,
  /** reference to openlayers select interaction which can optionally be managed by IA */
  selectInteraction: PropTypes.object,
  /** an object with `get` and `put` methods to handle measure state */
  preferences: PropTypes.object.isRequired,
  /** translations object */
  translations: PropTypes.object,
  /** boolean for enabling snap interaction */
  snap: PropTypes.bool,
  /** openlayers snap options */
  snapOpts: PropTypes.object,
  /** boolean enabling the measurement component */
  showMeasurements: PropTypes.bool,
  /** boolean enabling the coordinate labels component */
  showCoordinateLabels: PropTypes.bool,
  /** velocity preference of either imperial or metric */
  uom: PropTypes.string,
  /** openlayers draw interaction constructor props */
  drawOpts: PropTypes.object,
  /** callback that returns the selected openlayers feature from the map */
  selectedFeature: PropTypes.func,
  /** pass child comps to opt out of the default controls */
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
}

DrawContainer.defaultProps = {
  drawOpts: {},
  snap: true,
  showMeasurements: true,
  showCoordinateLabels: true,
  preferences: { status: 'success', payload: new MockPreferences() },
  selectedFeature: () => {}
}

export default connectToMap(DrawContainer)
