import React from 'react'
import PropTypes from 'prop-types'
import debounce from 'lodash.debounce'
import olObservable from 'ol/observable'

import TimeSliderBase from './TimeSliderBase'
import { connectToMap } from 'Map'

class TimeSlider extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      idx: 0,
      open: true
    }

    this.moveHandler = e => this.fetchFeaturesForCurrentExtent()
  }

  componentDidMount = () => {
    const { map } = this.props
    const layers = map.getLayers()
    const handleLayerChange = e => {
      this.forceUpdate() // force a re-render if layers are added or removed
    }

    // kicks off the process of fetching features for the current extent
    // this.fetchFeaturesForCurrentExtent()

    // bind the event listener
    this.layerListener = layers.on('change:length', handleLayerChange)
    // this.props.map.on('moveend', debounce(this.moveHandler, 1000))
  }

  componentWillUnmount = () => {
    // unbind the listener
    olObservable.unByKey(this.layerListener)
    this.props.map.un('moveend', this.moveHandler)
  }

  // fetchFeaturesForCurrentExtent = () => {
  //   const { map, layer } = this.props
  //   const extent = map.getView().calculateExtent()

  //   // use the geoserver methods to request intersection features -- then pull their dates off them
  //   layer.fetchFeaturesIntersectingExtent(extent, { featureTypes: [] }).then(res => {
  //     if (res.length < MAX_DATES) {
  //       const dates = res
  //         .map(f => new Date(f.get(layer.getTimeAttribute()))) /* we convert all dates to JS dates for easier use */
  //         .sort((a, b) => a - b) /* the sort must happen before the filter in order to remove dup dates */
  //         .filter((d, i, a) => datesDiffDay(a[i], a[i - 1])) /* this removes dup dates (precision is down to the day) */

  //       const firstDayOfFirstMonth = moment(dates[0]).startOf('month')

  //       this.setState({
  //         dates,
  //         tooManyDates: false,
  //         selectedDate: null,
  //         selectedDateRange: [],
  //         firstDayOfFirstMonth: firstDayOfFirstMonth,
  //         numOfDays: moment(dates[dates.length - 1]).diff(moment(dates[0]), 'days', true)
  //       })
  //     } else {
  //       this.setState({ tooManyDates: true })
  //     }
  //   })
  // }

  onFilterChange = filter => {
    console.log('onFilterChange', filter)
  }

  render () {
    const { map, translations } = this.props
    const { idx, open } = this.state
    const timeEnabledLayers = map.getLayers().getArray().filter(l => !!l.get('timeEnabledKey'))
    const groups = timeEnabledLayers.map(l => (
      { 
        dates: l.getSource().getFeatures().map(f => f.get(l.get('timeEnabledKey'))),
        title: l.get('title')
      }
    ))
    const geoserverTimeEnabledLayers = map.getLayers().getArray().filter(l => l.isGeoserverLayer && !!l.getTimeAttribute()) // eslint-disable-line

    console.log('timeEnabledLayers', timeEnabledLayers)
    return (
      <TimeSliderBase
        groups={groups}
        layers={timeEnabledLayers}
        onFilterChange={this.onFilterChange}
        translations={translations}
        show={true} />
    )
  }
}

TimeSlider.propTypes = {
  map: PropTypes.object.isRequired,
  translations: PropTypes.object
}

export default connectToMap(TimeSlider)
