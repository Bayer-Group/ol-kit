import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { ScaleLineContainer } from './styled'
import { ScaleLine as olScaleLine } from 'ol/control'

import { connectToContext } from 'Provider'

class ScaleLine extends React.Component {
  constructor (props) {
    super(props)
    this.scaleLineContainer = React.createRef()
  }

  componentDidMount () {
    const { map } = this.props
    const scale = new olScaleLine({
      target: this.scaleLineContainer.current,
      units: 'metric',
      text: false,
    })

    this.setState({ scale }, () => scale.setMap(map))
  }

  componentWillUnmount () {
    this.setState({ scale: null }, () => this.state.scale.setMap(null))
  }

  render () {
    return (
      <ScaleLineContainer ref={this.scaleLineContainer} />
    )
  }
}

ScaleLine.propTypes = {
  /** reference to Openlayers map object */
  map: PropTypes.object.isRequired,
}

export default connectToContext(ScaleLine)