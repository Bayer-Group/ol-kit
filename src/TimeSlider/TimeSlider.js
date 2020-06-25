import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import debounce from 'lodash.debounce'
import olObservable from 'ol/observable'
import olSelect from 'ol/interaction/select'

import TimeSliderBase from './TimeSliderBase'
import { datesDiffDay, datesSameDay } from './utils'
import { connectToMap } from 'Map'

/** TimeSlider component used to display/filter data with time attributes
 * @component
 * @category TimeSlider
 * @since 0.12.0
 */
class TimeSlider extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      groups: [],
      index: 0,
      show: true
    }

    this.moveHandler = debounce(e => this.state.show && this.setGroupsFromExtent(), 100)
  }

  componentDidMount = () => {
    const { map } = this.props
    const layers = map.getLayers()

    // kicks off the process of fetching features for the current extent
    this.setGroupsFromExtent()

    // bind the event listener
    this.layerListener = layers.on('change:length', this.moveHandler)
    map.on('moveend', this.moveHandler)
  }

  componentWillUnmount = () => {
    const { map } = this.props

    // unbind the listener
    olObservable.unByKey(this.layerListener)
    map.un('moveend', this.moveHandler)
  }

  fetchFeaturesForCurrentExtent = async layer => {
    const { map } = this.props
    const extent = map.getView().calculateExtent()

    let dates = []

    if (layer.isGeoserverLayer && !!layer.getTimeAttribute()) {
      // use the geoserver methods to request intersection features -- then pull their dates off them
      const res = await layer.fetchFeaturesIntersectingExtent(extent, { featureTypes: [] })

      // we convert all dates to JS dates for easier use
      dates = res.map(f => new Date(f.get(layer.getTimeAttribute())))
    } else if (layer.get('_ol_kit_time_key')) {
      // this key must be set on a layer to enable time slider
      const source = layer.getSource()
      const featuresInExtent = source?.getFeaturesInExtent(extent) || []

      // we convert all dates to JS dates for easier use
      dates = featuresInExtent.map(f => new Date(f.get(layer.get('_ol_kit_time_key'))))
    }

    const sortedDates = dates
      .sort((a, b) => a - b) /* the sort must happen before the filter in order to remove dup dates */
      .filter((d, i, a) => datesDiffDay(a[i], a[i - 1])) /* this removes dup dates (precision is down to the day) */

    return sortedDates
  }

  setGroupsFromExtent = async () => {
    const { map } = this.props
    const timeEnabledLayers = map.getLayers().getArray().filter(l => !!l.get('_ol_kit_time_key') || (l.isGeoserverLayer && !!l.getTimeAttribute()))
    const groups = []

    await timeEnabledLayers.forEach(async layer => {
      const dates = await this.fetchFeaturesForCurrentExtent(layer)
      const tickColor = null // fetch style off layer: layer.getStyle()

      groups.push({
        dates,
        id: layer.ol_uid,
        tickColor,
        title: layer.get('title')
      })
    })

    this.setState({ groups })
  }

  onDatesChange = ({ id, selectedDate, selectedDateRange }) => {
    const { map, selectInteraction } = this.props
    const extent = map.getView().calculateExtent()
    const layer = map.getLayers().getArray().find(l => l.ol_uid === id)
    const source = layer?.getSource()

    if (selectedDate) {
      // select the date selected
      const deselected = selectInteraction.getFeatures().getArray()
      const features = source.getFeatures().filter(f => datesSameDay(new Date(f.get(layer.get('_ol_kit_time_key'))), selectedDate))
      const selected = [...features]
      const event = new olSelect.Event('select', selected, deselected)

      // clear the previously selected feature before adding newly selected feature so only one feature is "selected" at a time
      selectInteraction.getFeatures().clear()
      features.forEach(feature => selectInteraction.getFeatures().push(feature))
      selectInteraction.dispatchEvent(event)

      if (layer.isGeoserverLayer) {
        // update the layer to reflect the time extent selected
        layer.getWMSLayer().getSource().updateParams({
          TIME: `${(new Date(selectedDate)).toISOString().split('T')[0]}/${(new Date(selectedDate)).toISOString().split('T')[0]}`
        })
      }
    } else if (selectedDateRange && selectedDateRange.length) {
      // logic for drag select
      if (layer.isGeoserverLayer) {
        layer.getWMSLayer().getSource().updateParams({
          TIME: `${(new Date(selectedDateRange[0])).toISOString().split('T')[0]}/${(new Date(selectedDateRange[1])).toISOString().split('T')[0]}`
        })
      } else {
        const allFeatures = source.getFeaturesInExtent(extent)
        const features = allFeatures.filter(f => moment(new Date(f.get(layer.get('_ol_kit_time_key')))).isBetween(selectedDateRange[0], selectedDateRange[1]))
        const deselected = selectInteraction.getFeatures().getArray()
        const selected = [...features]
        const event = new olSelect.Event('select', selected, deselected)

        // clear the previously selected feature before adding newly selected feature so only one feature is "selected" at a time
        selectInteraction.getFeatures().clear()
        features.forEach(feature => selectInteraction.getFeatures().push(feature))
        selectInteraction.dispatchEvent(event)
      }
    } else if (!selectedDate) {
      // reset filter

      // clear select
      selectInteraction.getFeatures().clear()

      if (layer.isGeoserverLayer) {
        // update the layer to reflect the time extent selected
        layer.getWMSLayer().getSource().updateParams({ TIME: null })
        // refresh the layer source to update the map
        layer.getWMSLayer().getSource().refresh()
      }
    }
  }

  onClose = () => {
    this.setState({ show: false })
    this.props.onClose()
  }

  render () {
    const { show: propShow } = this.props
    const { groups, show: stateShow } = this.state
    const show = typeof propShow === 'boolean' ? propShow : stateShow // keep show prop as source of truth over state

    return (
      !show
        ? null
        : (
          <TimeSliderBase
            groups={groups}
            onClose={this.onClose}
            onDatesChange={this.onDatesChange} />
        )
    )
  }
}

TimeSlider.defaultProps = {
  onClose: () => {},
  show: undefined
}

TimeSlider.propTypes = {
  /** callback fired when TimeSlider 'x' is clicked */
  onClose: PropTypes.func,
  /** a reference to openlayers map object */
  map: PropTypes.object.isRequired,
  /** reference to openlayers select interaction */
  selectInteraction: PropTypes.object,
  /** boolean that is respected over internal state */
  show: PropTypes.bool
}

export default connectToMap(TimeSlider)
