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

import olInteractionModify from 'ol/interaction/Modify'
import olCollection from 'ol/Collection'

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

class FeatureEditor extends Component {
  constructor (props) {
    super(props)
    this.state = {
      interactions: [],
      editFeatures: undefined,
      showMeasurements: false,
      canceled: false,
      finished: false
    }
  }

  /** In the past we've used temporary layers added to the map to avoid modifying the original features directly.
  However, this leads to a lot of cleanup since those layers need to be added/removed from both the map and state.
  That is fine as long as everything goes smoothly but if there is additional logic listening to the map for changes to it's features
   or layers than we can get left in a broken state that requires a reload.  Using vectorContext.drawFeature instead of
   a layer added to the map alleviates at least some of this risk.*/
  _renderFeature = (vectorContext, feature, editStyle = this.props.editStyle) => { // vectorContext.drawFeature only respects a style object and since it is common to have style functions and arrays in Openlayers we need to break the other formats down into objects
    const { map, areaUOM, distanceUOM } = this.props
    const { showMeasurements } = this.state
    const measurementStyles = showMeasurements ? editStyle(feature, map, showMeasurements, { areaUOM, distanceUOM }) : editStyle // eslint-disable-line
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
            editStyle(feature, map, showMeasurements, { areaUOM, distanceUOM })
          ) // eslint-disable-line Openlayers style functions return style objects or arrays of style objects so we can call functions recursively.
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
    const { editFeatures } = this.state

    const vectorContext = getVectorContext(e)

    if (!editFeatures) return // to avoid using a setStateCallback we just check for editFeatures first

    editFeatures.forEach(feature => this._renderFeature(vectorContext, feature, editStyle))

    return map.render() // render the results asynchronously
  }

  _addPostComposeListener = () => {
    const { editFeatures } = this.state

    editFeatures.getArray()[0]?.get('_ol_kit_parent')?.on('postrender', this._renderEditOverlay)
  }

  _removePostComposeListener = () => {
    const { editFeatures } = this.state

    editFeatures.getArray()[0]?.get('_ol_kit_parent')?.un('postrender', this._renderEditOverlay)
  }

  _end = () => { // this function cleans up our state and map.  If this does not execute correctly we could get stuck in a corrupted map state.
    try {
      const { map } = this.props
      const { interactions } = this.state

      this._removePostComposeListener()

      interactions.forEach(i => map.removeInteraction(i))
    } catch (err) {
      console.warn(`Geokit encountered a problem while editing a feature: ${err.message}. \n`, err) // eslint-disable-line no-console
    }
  }

  showMeasurements = () => {
    this.setState({ showMeasurements: !this.state.showMeasurements })
  }

  cancelEdit = () => {
    const { onEditCancel, editOpts: { features } } = this.props

    this.setState({ canceled: true }, () => onEditCancel(features))
  }

  finishEdit = () => {
    const { onEditFinish } = this.props
    const { editFeatures } = this.state

    this.setState({ finished: true }, () => onEditFinish(editFeatures.getArray()))
  }

  componentDidMount () {
    const { editOpts, map, onEditBegin } = this.props
    const { features } = editOpts
    const { interactions } = this.state

    if (interactions.length === 2) return

    const editFeatures = new olCollection(features.map(f => f.clone())) // create a collection of clones of the features in props, this avoids modifying the existing features

    const opts = Object.assign({}, editOpts, {
      pixelTolerance: 10,
      features: editFeatures,
      deleteCondition: ({ originalEvent, type }) => {
        const { altKey, ctrlKey, shiftKey, metaKey } = originalEvent
        const modifierKeyActive = altKey || ctrlKey || shiftKey || metaKey
        const altClick = type === 'click' && modifierKeyActive
        const rightClick = (type === 'pointerdown' || type === 'click') && originalEvent.button === 2

        return rightClick || altClick
      }
    })

    const translateInteraction = new Translate({ features: editFeatures }) // ol/interaction/translate only checks for features on the map and since we are not adding these to the map (see additional comments) we use our own that knows to look for the features we pass to it whether or not they're on the map.
    const modifyInteraction = new olInteractionModify(opts) // ol/interaction/modify doesn't care about the features being on the map or not so it's good to go
    // const rotateInteraction = new Rotate(map, editFeatures.item(0), icons.rotate)

    this.setState({
      interactions: [modifyInteraction, translateInteraction],
      editFeatures,
      canceled: false,
      finished: false
    }, () => {
      this._addPostComposeListener()
    })
    // map.addInteraction(rotateInteraction)
    map.addInteraction(translateInteraction)
    map.addInteraction(modifyInteraction)
    onEditBegin({ oldFeatures: features, newFeatures: editFeatures.getArray(), newFeaturesCollection: editFeatures }) // callback function for IAs.  FeatureEditor doesn't do anything to the original features so we tell the IA which features they passed in as props and what features we are editing.  This should help if they want to add custom logic around these features.
  }

  componentWillUnmount () {
    const { canceled, finished } = this.state

    if (!canceled && !finished) console.warn(`Geokit FeatureEditor has been unmounted unexpectedly.  This may lead undesirable behaviour in your application.`) // eslint-disable-line no-console

    this._end()
  }

  render () {
    const { translations } = this.props

    return (
      <Toolbar>
        <Grid item>
          <ButtonCardActions>
            <LeftCard>
              <Button color='secondary' onClick={this.cancelEdit}>
                {'Cancel'}
              </Button>
            </LeftCard>
            <CenterCard style={{ paddingLeft: '20px', marginLeft: '0px' }}>
              <FormControlLabel
                style={{ marginBottom: '0px' }}
                control={
                  <Knob defaultValue={0} onChange={(val) => console.log(val)} />
                }
                label={'Rotate'}
              />
            </CenterCard>
            <RightCard>
              <Button color='primary' onClick={this.finishEdit}>
                {'Finish'}
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
    features: PropTypes.array,
    wrapX: PropTypes.bool
  }).isRequired,
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
  distanceUOM: PropTypes.string
}

FeatureEditor.defaultProps = {
  editOpts: {},
  onEditFinish: () => {},
  onEditBegin: () => {},
  onEditCancel: () => {},
  editStyle: (feature, map, showMeasurements = false, { areaUOM, distanceUOM }) => { // eslint-disable-line
    const translations = {
      '_ol_kit.DrawToolbar.cancel': 'Cancel [ESC]',
      '_ol_kit.DrawToolbar.finish': 'Finish',
      '_ol_kit.DrawToolbar.showMeasurements': 'Show measurements'
    }

    return immediateEditStyle(
      { areaUOM, distanceUOM, showMeasurements, map, translations, language: navigator.language },
      feature,
      map.getView().getResolution()
    )
  }
}

export default connectToContext(FeatureEditor)
