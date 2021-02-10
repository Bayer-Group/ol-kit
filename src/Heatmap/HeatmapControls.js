import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import MaterialSwitch from '@material-ui/core/Switch'

import { Container } from './styled'
import Layer from 'ol/layer/Layer'

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

const HeatmapControls = props => {
  const { layer, translations } = props
  const [blur, setBlur] = useState(layer?.getBlur() || 15)
  const [radius, setRadius] = useState(layer?.getRadius() || 5)

  const handleBlur = blur => {
    layer.setBlur(parseInt(blur))
    setBlur(blur)
  }
  const handleRadius = radius => {
    layer.setRadius(parseInt(radius))
    setRadius(radius)
  }

  return (
    <Container>
      Heatmap controls
      <div>
        <label htmlFor="radius">radius size</label>
        <input id="radius" type="range" min="1" max="50" step="1" value={radius} onChange={(e) => handleRadius(e.target.value)}/>
      </div>
      <div>
        <label htmlFor="blur">blur size</label>
        <input id="blur" type="range" min="1" max="50" step="1" value={blur} onChange={(e) => handleBlur(e.target.value)}/>
      </div>
    </Container>
  )
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
