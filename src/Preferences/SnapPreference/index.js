import React from 'react'
import PropTypes from 'prop-types'
import { FormControlWrapper, SwitchContainer, TextField, Switch, SwitchLabel } from '../styled'

export class SnapPreference extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      snappingEnabled: props.preferences.get('_SNAPPING_ENABLED') || false,
      snappingTolerance: props.preferences.get('_SNAPPING_TOLERANCE') || 5
    }
  }

  updateSnapEnable = () => {
    this.setState({ snappingEnabled: !this.state.snappingEnabled })
    this.props.preferences.put('_SNAPPING_ENABLED', !this.state.snappingEnabled).then(response => {
      this.props.onChange({ type: '_SNAPPING_ENABLED', response })
    })
  }

  updateSnapTolerance = (e) => {
    // this should be safe b/c we have type='number' on the input
    const parsedNum = Number(e.target.value)

    this.setState({ snappingTolerance: parsedNum })
    this.props.preferences.put('_SNAPPING_TOLERANCE', parsedNum).then(response => {
      this.props.onChange({ type: '_SNAPPING_TOLERANCE', response })
    })
  }

  render () {
    const { translations, compact } = this.props
    const { snappingEnabled, snappingTolerance } = this.state

    return (
      <div>
        { !compact ? (<h5><b>{translations['_ol_kit.settings.snapping.title']}</b></h5>) : null }
        { !compact ? (<p>{translations['_ol_kit.settings.snapping.description']}</p>) : null }
        <FormControlWrapper>
          <SwitchContainer compact={compact ? true : undefined} id='snapBuffer'>
            <SwitchLabel compact={compact ? true : undefined} htmlFor='snapBuffer'>{compact ? translations['_ol_kit.settings.snapping.title'] : translations['_ol_kit.settings.turnOnOff']}</SwitchLabel>
            <Switch color='primary'
              checked={snappingEnabled}
              onChange={this.updateSnapEnable.bind(this)}
              value={snappingEnabled}/>
          </SwitchContainer>
          {snappingEnabled &&
            <TextField compact={compact ? true : undefined} styles={{ bottom: '5px' }}
              label='Pixel Tolerance'
              value={snappingTolerance}
              onChange={this.updateSnapTolerance.bind(this)} />}
        </FormControlWrapper>
      </div>
    )
  }
}

SnapPreference.propTypes = {
  snappingEnabled: PropTypes.bool,
  snappingTolerance: PropTypes.number,
  translations: PropTypes.object,
  persistSnappingEnable: PropTypes.func,
  persistSnappingTolerance: PropTypes.func,
  preferences: PropTypes.object,
  onChange: PropTypes.func,
  compact: PropTypes.bool
}

export default SnapPreference
