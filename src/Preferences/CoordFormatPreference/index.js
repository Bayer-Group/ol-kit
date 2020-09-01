import React from 'react'
import PropTypes from 'prop-types'
import { MenuItem, FormControl, Select } from '@material-ui/core'

export class CoordFormatPreference extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      coordFormat: props.preferences.get('_COORD_FORMAT') || 'DDM'
    }
    this.updateCoordFormat = this.updateCoordFormat.bind(this)
  }

  updateCoordFormat = (e) => {
    const coordFormat = e.target.value

    this.setState({ coordFormat })
    this.props.preferences.put('_COORD_FORMAT', coordFormat)
  }

  render () {
    const { translations } = this.props
    const { coordFormat } = this.state
    const options = [
      { value: 'DDM', label: translations['settings.coordformat.DDM'] },
      { value: 'DMS', label: translations['settings.coordformat.DMS'] }
    ]

    return (
      <div>
        <h5><b>{translations['settings.coordformat.title']}</b></h5>
        <p>{translations['settings.coordformat.description']}</p>
        <FormControl>
          <Select labelId='_geokit_coordFormat' value={coordFormat} onChange={this.updateCoordFormat}>
            {options.map(({ value, label }) => {
              return <MenuItem key={value} value={value}>{label}</MenuItem>
            })}
          </Select>
        </FormControl>
      </div>
    )
  }
}

CoordFormatPreference.propTypes = {
  translations: PropTypes.object,
  preferences: PropTypes.object
}

export default CoordFormatPreference
