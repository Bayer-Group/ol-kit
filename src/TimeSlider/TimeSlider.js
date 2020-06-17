import React from 'react'
import PropTypes from 'prop-types'
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
  }

  componentDidMount = () => {
    console.log('MOUNT')
    const { map } = this.props
    const layers = map.getLayers()
    const handleLayerChange = e => {
      this.forceUpdate() // force a re-render if layers are added or removed
    }

    // bind the event listener
    this.layerListener = layers.on('change:length', handleLayerChange)
  }

  componentWillUnmount = () => {
    // unbind the listener
    olObservable.unByKey(this.layerListener)
  }

  onCloseClicked = () => {
    this.setState({ open: false })
  }

  onTabClicked = (_, idx) => {
    this.setState({ idx })
  }

  render () {
    const { map, translations } = this.props
    const { idx, open } = this.state
    const geoserverTimeEnabledLayers = map.getLayers().getArray().filter(l => l.isGeoserverLayer && !!l.getTimeAttribute()) // eslint-disable-line

    return (
      <TimeSliderBase
        map={map}
        layers={geoserverTimeEnabledLayers}
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
