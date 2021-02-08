import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import MaterialSwitch from '@material-ui/core/Switch'

import { Container } from './styled'

const Switch = withStyles(() => ({
  switchBase: {
    color: '#152457',
    '&$checked': {
      color: '#152457'
    },
    '&$checked + $track': {
      backgroundColor: '#152457'
    }
  },
  checked: {},
  track: {}
}))(MaterialSwitch)

export class HeatmapControls extends React.Component {
  componentDidMount () {
    const { layer } = this.props

    const blur = document.getElementById('blur')
    const radius = document.getElementById('radius')

    const blurHandler = function () {
      layer.setBlur(parseInt(blur.value, 10))
    }
    blur.addEventListener('input', blurHandler)
    blur.addEventListener('change', blurHandler)
    
    const radiusHandler = function () {
      layer.setRadius(parseInt(radius.value, 10))
    }
    radius.addEventListener('input', radiusHandler)
    radius.addEventListener('change', radiusHandler)
  }

  render () {
    const { translations } = this.props

    return (
      <Container>
        Heatmap controls
        <div>
          <label for="radius">radius size</label>
          <input id="radius" type="range" min="1" max="50" step="1" value="5"/>
        </div>
        <div>
          <label for="blur">blur size</label>
          <input id="blur" type="range" min="1" max="50" step="1" value="15"/>
        </div>
      </Container>
    )
  }
}

HeatmapControls.propTypes = {
  translations: PropTypes.object,
}

HeatmapControls.defaultProps = {
  translations: {
    '_ol_kit.HeatmapControls.cancel': 'Cancel [ESC]',
    '_ol_kit.HeatmapControls.finish': 'Finish',
    '_ol_kit.HeatmapControls.showMeasurements': 'Show measurements'
  }
}

export default HeatmapControls
