import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Translate from 'classes/Translate'
import { immediateEditStyle } from './styles'
import { getVectorContext } from 'ol/render'
import { Toolbar } from 'Toolbar'
import { Knob } from 'react-rotary-knob'
import { connectToContext } from 'Provider'
import { Card, Grid, CardActions, Button, FormControlLabel } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import centroid from '@turf/centroid'
import { olKitTurf } from './utils'

import olInteractionModify from 'ol/interaction/Modify'
import olCollection from 'ol/Collection'
import olStyleStyle from 'ol/style/Style'

const ButtonCardActions = withStyles(() => ({
  root: {
    padding: '4px 4px 3px 4px'
  }
}))(CardActions)

const LeftCard = withStyles(() => ({
  root: {
    borderTopLeftRadius: '4px',
    borderBottomLeftRadius: '4px',
    borderBottomRightRadius: '0px',
    borderTopRightRadius: '0px',
    height: '38px'
  }
}))(Card)

const CenterCard = withStyles(() => ({
  root: {
    borderRadius: '0px',
    paddingLeft: '20px',
    marginLeft: '0px',
    height: '38px'
  }
}))(Card)

const RightCard = withStyles(() => ({
  root: {
    borderTopRightRadius: '4px',
    borderBottomRightRadius: '4px',
    borderTopLeftRadius: '0px',
    borderBottomLeftRadius: '0px',
    marginLeft: '0px !important',
    height: '38px'
  }
}))(Card)

/**
 * A component to edit geometries
 * @component
 * @category FeatureEditor
 * @since 1.16.0
 */
class FeatureEditor extends Component {
  constructor (props) {
    super(props)
    this.state = {
      interactions: [],
      editingFeature: null,
      showMeasurements: false,
      rotation: 0,
      style: null
    }
  }

  /** In the past we've used temporary layers added to the map to avoid modifying the original features directly.
  However, this leads to a lot of cleanup since those layers need to be added/removed from both the map and state.
  That is fine as long as everything goes smoothly but if there is additional logic listening to the map for changes to it's features
   or layers than we can get left in a broken state that requires a reload.  Using vectorContext.drawFeature instead of
   a layer added to the map alleviates at least some of this risk.*/
  _renderFeature = (vectorContext, feature, editStyle = this.props.editStyle) => { // vectorContext.drawFeature only respects a style object and since it is common to have style functions and arrays in Openlayers we need to break the other formats down into objects
    const { map, areaUOM, distanceUOM, translations } = this.props
    const { showMeasurements } = this.state
    const measurementStyles = showMeasurements ? editStyle(feature, map, showMeasurements, { areaUOM, distanceUOM }, translations) : editStyle // eslint-disable-line
    const styleType = Array.isArray(measurementStyles) ? 'array' : typeof editStyle

    try {
      switch (styleType) {
        case 'array':
          measurementStyles.map(style => {
            const geom = style.getGeometry() ? style.getGeometry() : feature.getGeometry()

            vectorContext.setStyle(style)
            vectorContext.drawGeometry(geom)
          }) // Arrays of style objects require a feature to be drawn for each style object in the array.  This could also be recursively called but that would add extra complexity.
          break
        case 'function':
          this._renderFeature(
            vectorContext,
            feature,
            editStyle(feature, map, showMeasurements, { areaUOM, distanceUOM }, translations)
          ) // Openlayers style functions return style objects or arrays of style objects so we can call functions recursively.
          break
        default: // style object
          vectorContext.drawFeature(feature, editStyle)
      }
    } catch (e) {
      console.warn(`Geokit was unable to draw the features to the map, this is most likely due to an invalid style object: ${e.message}`, e) // eslint-disable-line
    }
  }

  _renderEditOverlay = (e) => {
    const { map, editStyle } = this.props
    const { editingFeature } = this.state

    const vectorContext = getVectorContext(e)

    if (!editingFeature) return // to avoid using a setStateCallback we just check for editFeatures first

    this._renderFeature(vectorContext, editingFeature, editStyle)

    return map.render() // render the results asynchronously
  }

  _addPostComposeListener = () => {
    const { editingFeature } = this.state

    editingFeature?.get('_ol_kit_parent')?.on('postrender', this._renderEditOverlay) // eslint-disable-line
  }

  _removePostComposeListener = () => {
    const { editingFeature } = this.state

    editingFeature?.get('_ol_kit_parent')?.un('postrender', this._renderEditOverlay) // eslint-disable-line
  }

  _end = () => { // this function cleans up our state and map.  If this does not execute correctly we could get stuck in a corrupted map state.
    try {
      const { map } = this.props
      const { interactions } = this.state

      this._removePostComposeListener()

      interactions.forEach(i => map.removeInteraction(i))
      this.setState({ editingFeature: null, style: null, interactions: [] })
    } catch (err) {
      console.warn(`Geokit encountered a problem while editing a feature: ${err.message}. \n`, err) // eslint-disable-line no-console
    }
  }

  showMeasurements = () => {
    this.setState({ showMeasurements: !this.state.showMeasurements })
  }

  cancelEdit = () => {
    const { onEditCancel, editFeature, addEditFeatureToContext } = this.props
    const { style } = this.state

    this.setState(
      { canceled: true, editingFeature: null },
      () => onEditCancel(editFeature, addEditFeatureToContext, style)
    )
  }

  finishEdit = () => {
    const { onEditFinish, addEditFeatureToContext, editFeature } = this.props
    const { editingFeature, style } = this.state

    this.setState(
      { editingFeature: null },
      () => onEditFinish(editFeature, editingFeature, addEditFeatureToContext, style)
    )
  }

  init () {
    const { editOpts, map, onEditBegin, editFeature } = this.props

    const clonedFeature = editFeature.clone() // create a collection of clones of the features in props, this avoids modifying the existing features

    const opts = Object.assign({}, editOpts, {
      pixelTolerance: 10,
      features: new olCollection([clonedFeature]),
      deleteCondition: ({ originalEvent, type }) => {
        const { altKey, ctrlKey, shiftKey, metaKey } = originalEvent
        const modifierKeyActive = altKey || ctrlKey || shiftKey || metaKey
        const altClick = type === 'click' && modifierKeyActive
        const rightClick = (type === 'pointerdown' || type === 'click') && originalEvent.button === 2

        return rightClick || altClick
      }
    })

    const translateInteraction = new Translate({ features: new olCollection([clonedFeature]) }) // ol/interaction/translate only checks for features on the map and since we are not adding these to the map (see additional comments) we use our own that knows to look for the features we pass to it whether or not they're on the map.
    const modifyInteraction = new olInteractionModify(opts) // ol/interaction/modify doesn't care about the features being on the map or not so it's good to go
    const style = clonedFeature.getStyle()

    this.setState({
      anchor: olKitTurf(centroid, [clonedFeature.getGeometry()]).getGeometry().getCoordinates(),
      interactions: [modifyInteraction, translateInteraction],
      editingFeature: clonedFeature,
      style
    }, () => {
      this._addPostComposeListener()
    })
    map.addInteraction(translateInteraction)
    map.addInteraction(modifyInteraction)
    onEditBegin(clonedFeature) // callback function for IAs.  FeatureEditor doesn't do anything to the original features so we tell the IA which features they passed in as props and what features we are editing.  This should help if they want to add custom logic around these features.
  }

  componentDidMount () {
    if (!this.props.editFeature) return

    this.init()
  }

  componentDidUpdate (prevProps) {
    const { editFeature } = this.props
    const { interactions } = this.state

    if (prevProps.editFeature && !editFeature) return this._end()

    if (interactions.length === 2 || !editFeature) return

    this.init()
  }

  componentWillUnmount = () => {
    const { editingFeature } = this.state

    if (editingFeature) console.warn(`Geokit FeatureEditor has been unmounted unexpectedly.  This may lead undesirable behaviour in your application.`) // eslint-disable-line no-console

    return this._end()
  }

  rotate = (val) => {
    const { editingFeature, rotation, anchor } = this.state
    const geometry = editingFeature.getGeometry()
    const rotationDiff = val - rotation

    this.setState({ rotation: val }, () => geometry.rotate(-rotationDiff * (Math.PI / 180), anchor))
  }

  render () {
    const { translations } = this.props
    const { editingFeature } = this.state
    const knobStyle = {
      width: '35px',
      height: '35px',
      padding: '2px'
    }

    if (!editingFeature) return null

    return (
      <Toolbar>
        <Grid item>
          <ButtonCardActions>
            <LeftCard>
              <Button color='secondary' onClick={this.cancelEdit}>
                {translations['_ol_kit.edit.cancel']}
              </Button>
            </LeftCard>
            <CenterCard style={{ paddingLeft: '20px', marginLeft: '0px' }}>
              <FormControlLabel
                style={{ marginBottom: '0px' }}
                control={
                  <Knob style={knobStyle} unlockDistance={0} defaultValue={0} max={360} onChange={this.rotate} />
                }
                label={translations['_ol_kit.edit.rotate']}
              />
            </CenterCard>
            <RightCard>
              <Button color='primary' onClick={this.finishEdit}>
                {translations['_ol_kit.edit.finish']}
              </Button>
            </RightCard>
          </ButtonCardActions>
        </Grid>
      </Toolbar>
    )
  }
}

FeatureEditor.propTypes = {
  editOpts: PropTypes.exact({
    condition: PropTypes.string,
    deleteCondition: PropTypes.string,
    insertVertexCondition: PropTypes.string,
    pixelTolerance: PropTypes.number,
    style: PropTypes.object,
    source: PropTypes.object,
    wrapX: PropTypes.bool
  }).isRequired,
  editFeature: PropTypes.object,
  addEditFeatureToContext: PropTypes.func,
  map: PropTypes.object,
  onEditBegin: PropTypes.func,
  onEditFinish: PropTypes.func,
  onEditCancel: PropTypes.func,
  editStyle: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object,
    PropTypes.array
  ]),
  areaUOM: PropTypes.string,
  distanceUOM: PropTypes.string,
  translations: PropTypes.object
}

FeatureEditor.defaultProps = {
  editOpts: {},
  onEditFinish: (feature, updatedFeature, addEditFeatureToContext, style) => {
    const geom = updatedFeature.getGeometry()

    if (!feature) return

    feature.setGeometry(geom)

    feature.setStyle(style || null) // restore the original feature's style
    addEditFeatureToContext(null)
  },
  onEditBegin: (feature) => {
    feature.setStyle(new olStyleStyle({}))
  },
  onEditCancel: (feature, addEditFeatureToContext, style) => {
    feature.setStyle(style || null) // restore the original feature's style
    addEditFeatureToContext(null)
  },
  editStyle: (feature, map, showMeasurements = false, { areaUOM, distanceUOM }, translations) => { // eslint-disable-line
    return immediateEditStyle(
      { areaUOM, distanceUOM, showMeasurements, map, translations, language: navigator.language },
      feature,
      map.getView().getResolution()
    )
  }
}

export default connectToContext(FeatureEditor)
