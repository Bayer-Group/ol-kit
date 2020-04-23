import React, { Component } from 'react'
import MenuItem from '@material-ui/core/MenuItem'
import Divider from '@material-ui/core/Divider'
import { OpacityWrapper, OpacityTitle, Slider } from './styled'

class LayerPanelActionOpacity extends Component {
  render () {
    const { layer } = this.props

    return (
      <>
        <Divider />
        <MenuItem key={'opacity'} onClick={() => {}}>
          <OpacityWrapper>
            <OpacityTitle id='opacity-slider'>
                Opacity
            </OpacityTitle>
            <Slider
              disabled={false}
              min={0.1}
              max={1}
              step={0.1}
              defaultValue={layer.getOpacity()}
              onChangeCommitted={() => this.forceUpdate()}
              aria-labelledby='opacity-slider'
              onChange={(e, v) => layer.setOpacity(v) } />
          </OpacityWrapper>
        </MenuItem>
      </>
    )
  }
}

export default LayerPanelActionOpacity
