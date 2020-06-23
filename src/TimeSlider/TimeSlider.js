import React from 'react'
import PropTypes from 'prop-types'
import debounce from 'lodash.debounce'
import olObservable from 'ol/observable'
import olSelect from 'ol/interaction/select'

import TimeSliderBase from './TimeSliderBase'
import { datesDiffDay, datesSameDay } from './utils'
import { connectToMap } from 'Map'

class TimeSlider extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      groups: [],
      index: 0,
      show: true
    }

    this.moveHandler = debounce(e => this.setGroupsFromExtent(), 100)
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
    } else if (layer.get('timeEnabledKey')) {
      // this key must be set on a layer to enable time slider
      const source = layer.getSource()
      const featuresInExtent = source?.getFeaturesInExtent(extent) || []

      // we convert all dates to JS dates for easier use
      dates = featuresInExtent.map(f => new Date(f.get(layer.get('timeEnabledKey'))))
    }

    const sortedDates = dates
      .sort((a, b) => a - b) /* the sort must happen before the filter in order to remove dup dates */
      .filter((d, i, a) => datesDiffDay(a[i], a[i - 1])) /* this removes dup dates (precision is down to the day) */

    return sortedDates
  }

  setGroupsFromExtent = async () => {
    const { map } = this.props
    const timeEnabledLayers = map.getLayers().getArray().filter(l => !!l.get('timeEnabledKey') || (l.isGeoserverLayer && !!l.getTimeAttribute()))
    const groups = []

    await timeEnabledLayers.forEach(async layer => {
      const dates = await this.fetchFeaturesForCurrentExtent(layer)

      groups.push({
        dates,
        id: layer.ol_uid,
        title: layer.get('title')
      })
    })

    this.setState({ groups })
  }

  onFilterChange = filter => {
    console.log('onFilterChange', filter)
  }

  onDatesChange = e => {
    if (e.selectedDate) {
      // select the date selected
      const { map, selectInteraction } = this.props
      const deselected = selectInteraction.getFeatures().getArray()
      const layer = map.getLayers().getArray().find(l => l.ol_uid === e.id)
      const source = layer?.getSource()
      const features = source.getFeatures().filter(f => datesSameDay(new Date(f.get(layer.get('timeEnabledKey'))), e.selectedDate))
      const selected = [...features]
      const event = new olSelect.Event('select', selected, deselected)

      // clear the previously selected feature before adding newly selected feature so only one feature is "selected" at a time
      selectInteraction.getFeatures().clear()
      features.forEach(feature => selectInteraction.getFeatures().push(feature))
      selectInteraction.dispatchEvent(event)
    } else if (e.selectedDateRange) {
      // logic for drag select
    }

    // update the layer to reflect the time extent selected
    // this.props.layer.getWMSLayer().getSource().updateParams({
    //   TIME: `${(new Date(selectedDate)).toISOString().split('T')[0]}/${(new Date(selectedDate)).toISOString().split('T')[0]}`
    // })
  }

  onTabChange = index => {
    this.setState({ index })
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
            onFilterChange={this.onFilterChange}
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
  map: PropTypes.object.isRequired,
  selectInteraction: PropTypes.object,
  /** boolean that is respected over internal state */
  show: PropTypes.bool,
  translations: PropTypes.object
}

export default connectToMap(TimeSlider)
