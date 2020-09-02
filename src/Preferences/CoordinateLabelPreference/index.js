import React from 'react'
import PropTypes from 'prop-types'
import { FormControlWrapper, SwitchContainer, Switch, SwitchLabel } from '../styled'

export class CoordinateLabelPreference extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      pointLabelsEnabled: props.preferences.get('_POINT_LABELS_ENABLED') || false
    }
  }

  updatePointLabelEnable = () => {
    this.setState({ pointLabelsEnabled: !this.state.pointLabelsEnabled })
    this.props.preferences.put('_POINT_LABELS_ENABLED', !this.state.pointLabelsEnabled).then(response => {
      this.props.onChange({ type: '_POINT_LABELS_ENABLED', response })
    })
  }

  render () {
    const { translations, compact } = this.props
    const { pointLabelsEnabled } = this.state

    return (
      <div>
        {!compact && <h5><b>{translations['_ol_kit.settings.coordinateLabels.toggleLabel']}</b></h5>}
        {!compact && <p>{translations['_ol_kit.settings.coordinateLabels.description']}</p>}
        <FormControlWrapper>
          <SwitchContainer compact={compact ? true : undefined} id='_POINT_LABELS_ENABLED'>
            <SwitchLabel compact={compact ? true : undefined} htmlFor='_POINT_LABELS_ENABLED'>{compact ? translations['_ol_kit.settings.coordinateLabels.toggleLabel'] : translations['settings.turnOnOff']}</SwitchLabel>
            <Switch color='primary'
              checked={pointLabelsEnabled}
              onChange={this.updatePointLabelEnable.bind(this)}
              value={pointLabelsEnabled}/>
          </SwitchContainer>
        </FormControlWrapper>
      </div>
    )
  }
}

CoordinateLabelPreference.propTypes = {
  snappingEnabled: PropTypes.bool,
  snappingTolerance: PropTypes.number,
  translations: PropTypes.object,
  persistSnappingEnable: PropTypes.func,
  persistSnappingTolerance: PropTypes.func,
  preferences: PropTypes.object,
  onChange: PropTypes.func,
  compact: PropTypes.bool
}

export default CoordinateLabelPreference
