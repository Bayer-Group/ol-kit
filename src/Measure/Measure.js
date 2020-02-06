import uuid from 'uuid'
import React from 'react'
import PropTypes from 'prop-types'
import { Container, UomContainer, FormControl } from './styled'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import { calculateAreaAndDistance } from './utils'
import { connectToMap } from 'Map'

const UNIT_OPTIONS = {
  imperial: [
    {
      name: 'feet',
      translationsKey: 'geokit.units.feet'
    },
    {
      name: 'yards',
      translationsKey: 'geokit.units.yards'
    },
    {
      name: 'miles',
      translationsKey: 'geokit.units.miles'
    },
    {
      name: 'acres',
      translationsKey: 'geokit.units.acres',
      strictAreaUnit: true
    }
  ],
  metric: [
    {
      name: 'meters',
      translationsKey: 'geokit.units.meters'
    },
    {
      name: 'kilometers',
      translationsKey: 'geokit.units.kilometers'
    },
    {
      name: 'hectares',
      translationsKey: 'geokit.units.hectares',
      strictAreaUnit: true
    }
  ]
}

class Measure extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      uomType: props.uom,
      uom: props.uom === 'imperial' ? 'feet' : 'meters',
      areaUom: props.uom === 'imperial' ? 'feet' : 'meters',
      distance: '',
      area: '',
      isAreaUnit: false
    }
  }

  setMeasurementTextLabels = () => {
    const { uom, areaUom, geometry } = this.state
    const { feature, map } = this.props

    if (!feature && !geometry) return
    const featureGeometry = feature ? feature.getGeometry() : geometry
    const { area, distance } = calculateAreaAndDistance(map, featureGeometry, areaUom, uom)
    const areaString = this.toLocaleString(area)
    const distanceString = this.toLocaleString(distance)

    this.setState({ distance: distanceString, area: areaString, geometry: featureGeometry }) // eslint-disable-line
  }

  toLocaleString = (distance) => {
    return distance ? distance.toLocaleString([window.navigator.language, 'en-US']) : ''
  }

  handleUomChange = ({ target }) => {
    const { areaUom } = this.state
    const { onUomChange } = this.props

    this.setState({ uom: target.value }, () => {
      this.setMeasurementTextLabels()
      onUomChange({ uom: target.value, areaUom })
    })
  }

  handleAreaUomChange = ({ target }) => {
    const { uom } = this.state
    const { onUomChange } = this.props

    this.setState({ areaUom: target.value }, () => {
      this.setMeasurementTextLabels()
      onUomChange({ uom, areaUom: target.value })
    })
  }

  handleGeometryChange = () => {
    this.setMeasurementTextLabels()
  }

  getFeatureId = feature => {
    const currentId = feature.getId()

    if (currentId) {
      return currentId
    } else {
      const newId = uuid.v4()

      feature.setId(newId)

      return newId
    }
  }

  componentDidUpdate (prevProps) {
    const { feature, geometryType } = this.props
    const prevFeature = prevProps.feature

    if ((!prevProps.geometryType && geometryType) || prevProps.geometryType !== geometryType) {
      this.setState({ isAreaUnit: geometryType === 'Polygon' || geometryType === 'MultiPolygon' || geometryType === 'Circle' })
    }

    if (!prevFeature && !feature) return

    if (!feature && prevFeature) {
      return prevFeature.getGeometry().un('change', this.handleGeometryChange)
    }

    const featureUpdated = (!prevFeature && feature) || (this.getFeatureId(prevFeature) !== this.getFeatureId(feature))

    if (featureUpdated) {
      const updatedGeomType = feature.getGeometry().getType()

      feature.getGeometry().on('change', this.handleGeometryChange)
      this.setState({ isAreaUnit: updatedGeomType === 'Polygon' || updatedGeomType === 'MultiPolygon' || updatedGeomType === 'Circle' })
      this.setMeasurementTextLabels()
    }
  }

  render () {
    const { uom, areaUom, distance, area, uomType, isAreaUnit } = this.state
    const { translations } = this.props
    const removeSquared = (name) => name === ('acres' || 'hectares')

    return (
      <Container>
        <UomContainer>
          <span>{translations['geokit.Measurement.distance']} {distance}</span>
          <FormControl>
            <InputLabel htmlFor='distance'>Distance</InputLabel>
            <Select value={uom} onChange={this.handleUomChange} >
              {UNIT_OPTIONS[uomType].map(({ name, translationsKey, strictAreaUnit }) => {
                return !strictAreaUnit
                  ? <MenuItem key={name} value={name}>{translations[translationsKey]}</MenuItem> : null
              })}
            </Select>
          </FormControl>
        </UomContainer>
        <UomContainer>
          <span>{translations['geokit.Measurement.area']} {area}</span>
          <FormControl>
            <InputLabel htmlFor='distance'>Area</InputLabel>
            <Select disabled={!isAreaUnit} value={areaUom} onChange={this.handleAreaUomChange} >
              {UNIT_OPTIONS[uomType].map(({ name, translationsKey }) => {
                const translation = translations[translationsKey]

                return <MenuItem key={name} value={name}>{removeSquared(name) ? translation : `sq ${translation}`}</MenuItem>
              })}
            </Select>
          </FormControl>
        </UomContainer>
      </Container>
    )
  }
}

Measure.propTypes = {
  map: PropTypes.object.isRequired,
  translations: PropTypes.object,
  uom: PropTypes.string.isRequired,
  isAreaUnit: PropTypes.bool,
  feature: PropTypes.object,
  onUomChange: PropTypes.func,
  geometryType: PropTypes.string
}

Measure.defaultProps = {
  translations: {
    'geokit.Measurement.distance': 'Distance: ',
    'geokit.Measurement.area': 'Area: ',
    'geokit.units.feet': 'Feet',
    'geokit.units.yards': 'Yards',
    'geokit.units.miles': 'Miles',
    'geokit.units.acres': 'Acres',
    'geokit.units.meters': 'Meters',
    'geokit.units.kilometers': 'Kilometers',
    'geokit.units.hectares': 'Hectares'
  },
  onUomChange: () => {},
  uom: 'imperial'
}

export default connectToMap(Measure)
