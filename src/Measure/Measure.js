import { nanoid } from 'nanoid'
import React from 'react'
import PropTypes from 'prop-types'

import en from 'locales/en'
import { Container, UomContainer } from './styled'
import MenuItem from '@material-ui/core/MenuItem'
import { calculateAreaAndDistance } from './utils'
import { MeasureLabelPreference } from 'Preferences'
import { connectToContext } from 'Provider'

const UNIT_OPTIONS = {
  imperial: [
    {
      name: 'feet',
      translationsKey: '_ol_kit.units.feet'
    },
    {
      name: 'yards',
      translationsKey: '_ol_kit.units.yards'
    },
    {
      name: 'miles',
      translationsKey: '_ol_kit.units.miles'
    },
    {
      name: 'nautical-miles',
      translationsKey: '_ol_kit.units.nauticalmiles'
    },
    {
      name: 'acres',
      translationsKey: '_ol_kit.units.acres',
      strictAreaUnit: true
    }
  ],
  metric: [
    {
      name: 'meters',
      translationsKey: '_ol_kit.units.meters'
    },
    {
      name: 'kilometers',
      translationsKey: '_ol_kit.units.kilometers'
    },
    {
      name: 'nautical-miles',
      translationsKey: '_ol_kit.units.nauticalmiles'
    },
    {
      name: 'hectares',
      translationsKey: '_ol_kit.units.hectares',
      strictAreaUnit: true
    }
  ]
}

class Measure extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      uomType: props.uom,
      distanceUOM: props.uom === 'imperial' ? 'feet' : 'meters',
      areaUOM: props.uom === 'imperial' ? 'acres' : 'hectares',
      distance: '',
      area: '',
      isAreaUnit: false
    }
  }

  componentDidMount () {
    const { uom } = this.props

    this.setState({
      uomType: uom,
      distanceUOM: uom === 'imperial' ? 'feet' : 'meters',
      areaUOM: uom === 'imperial' ? 'acres' : 'hectares'
    })
  }

  setMeasurementTextLabels = () => {
    const { distanceUOM, areaUOM, geometry } = this.state
    const { feature, map } = this.props

    if (!feature && !geometry) return
    const featureGeometry = feature ? feature.getGeometry() : geometry
    const { area, distance } = calculateAreaAndDistance(map, featureGeometry, areaUOM, distanceUOM)
    const areaString = this.toLocaleString(area)
    const distanceString = this.toLocaleString(distance)

    this.setState({ distance: distanceString, area: areaString, geometry: featureGeometry })
  }

  toLocaleString = (distance) => {
    return distance ? distance.toLocaleString([window.navigator.language, 'en-US']) : ''
  }

  handleUomChange = (evt) => {
    const { onUomChange, preferences } = this.props
    const areaUOM = preferences.get('_AREA_LABEL_UOM') || this.state.areaUOM
    const distanceUOM = preferences.get('_DISTANCE_LABEL_UOM') || evt?.target?.value

    this.setState({ distanceUOM }, () => {
      this.setMeasurementTextLabels()
      onUomChange({
        uom: distanceUOM,
        areaUom: areaUOM,
        distanceUOM,
        areaUOM
      })
    })
  }

  handleAreaUomChange = (evt) => {
    const { onUomChange, preferences } = this.props
    const areaUOM = preferences.get('_AREA_LABEL_UOM') || evt?.target?.value
    const distanceUOM = preferences.get('_DISTANCE_LABEL_UOM') || this.state.distanceUOM

    this.setState({ areaUOM }, () => {
      this.setMeasurementTextLabels()
      onUomChange({
        uom: distanceUOM,
        areaUom: areaUOM,
        distanceUOM,
        areaUOM
      })
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
      const newId = nanoid()

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
    const { distanceUOM, areaUOM, distance, area, uomType } = this.state
    const { translations, preferences, drawMode } = this.props
    const removeSquared = (name) => (name === 'acres') || (name === 'hectares')
    const disableDistanceMeasurement = drawMode === 'Circle'

    return (
      <Container>
        <UomContainer>
          <MeasureLabelPreference
            uomOptions={UNIT_OPTIONS[uomType].map(({ name, translationsKey, strictAreaUnit }) => {
              return !strictAreaUnit
                ? <MenuItem data-testid={`_ol_kit-Measure-uom-${name}`} key={name} value={name}>{translations[translationsKey]}</MenuItem> : null
            })}
            compact={true}
            translations={translations}
            preferences={preferences}
            onChange={this.handleUomChange.bind(this)}
            enabledPreferenceKey={'_DISTANCE_LABEL_ENABLED'}
            valuePreferenceKey={'_DISTANCE_LABEL_UOM'}
            defaultUOM={distanceUOM}
            disabled={disableDistanceMeasurement}>
            <span>{translations['_ol_kit.Measurement.distance']} {distance}</span>
          </MeasureLabelPreference>
        </UomContainer>
        <UomContainer>
          <MeasureLabelPreference
            uomOptions={UNIT_OPTIONS[uomType].map(({ name, translationsKey }) => {
              const translation = translations[translationsKey]

              return <MenuItem key={name} value={name}>{removeSquared(name) ? translation : `sq ${translation}`}</MenuItem>
            })}
            compact={true}
            translations={translations}
            preferences={preferences}
            onChange={this.handleAreaUomChange.bind(this)}
            enabledPreferenceKey={'_AREA_LABEL_ENABLED'}
            valuePreferenceKey={'_AREA_LABEL_UOM'}
            defaultUOM={areaUOM}
            disabled={false}>
            <span>{translations['_ol_kit.Measurement.area']} {area}</span>
          </MeasureLabelPreference>
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
  geometryType: PropTypes.string,
  preferences: PropTypes.object,
  drawMode: PropTypes.string
}

Measure.defaultProps = {
  translations: en,
  onUomChange: () => {},
  uom: 'imperial'
}

export default connectToContext(Measure)
