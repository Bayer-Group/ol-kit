import React, { Component } from 'react'
import PropTypes from 'prop-types'
import olSelect from 'ol/interaction/select'
import olStyle from 'ol/style/style'
import olStroke from 'ol/style/stroke'
import olCircle from 'ol/style/circle'
import olFill from 'ol/style/fill'

import { connectToMap } from 'Map'
import PopupDefaultPage from './PopupDefaultPage'
import PopupPageLayout from './PopupPageLayout'

/**
 * @component
 * @category Popup
 */
class PopupInsert extends Component {
  constructor (props) {
    super(props)

    this.state = {
      selectedIdx: 0
    }
  }

  componentDidMount () {
    const { map, selectInteraction } = this.props

    // check for select interaction passed as a prop
    if (selectInteraction) {
      this.selectInteraction = selectInteraction
    } else {
      // this style determines how features will look when they are "selected"
      const style = new olStyle({
        stroke: new olStroke({
          color: 'cyan',
          width: 3
        }),
        image: new olCircle({
          radius: 5,
          fill: new olFill({
            color: 'white'
          }),
          stroke: new olStroke({
            color: 'cyan',
            width: 2
          })
        })
      })

      this.selectInteraction = new olSelect({
        hitTolerance: 3,
        style: [style],
        removeCondition: () => true // removes ol's selection action
      })
      map.addInteraction(this.selectInteraction)
    }
  }

  UNSAFE_componentWillReceiveProps (nextProps) { // eslint-disable-line camelcase
    if (!!nextProps.selectInteraction && !this.props.selectInteraction) {
      // update the select interaction to use passed prop
      this.selectInteraction = this.props.selectInteraction
    }
    if (nextProps.selectedIdx !== this.props.selectedIdx) {
      // if props update paging/selected feature, keep state in sync
      this.onPageChange(this.props.selectedIdx, nextProps.selectedIdx)
    }
    if (nextProps.features.length && nextProps.features.length !== this.props.features.length) {
      this.selectFeature(nextProps.features[nextProps.selectedIdx]) // TODO
    }
  }

  selectFeature = feature => {
    const deselected = this.selectInteraction.getFeatures().getArray()
    const selected = [feature]
    const event = new olSelect.Event('select', selected, deselected)

    // clear the previously selected feature before adding newly selected feature so only one feature is "selected" at a time
    this.selectInteraction.getFeatures().clear()
    this.selectInteraction.getFeatures().push(feature)
    this.selectInteraction.dispatchEvent(event)

    this.props.onSelectFeature(feature, this.state.selectedIdx)
  }

  onPageChange = (currIdx, nextIdx) => {
    const { features } = this.state

    if (features.length) {
      // select new feature when paging & update state
      this.selectFeature(features[nextIdx])
      this.setState({ selectedIdx: nextIdx })
    }
  }

  render () {
    const { features, loading, onClose, onSettingsClick, propertiesFilter, showSettingsCog } = this.props
    const { selectedIdx } = this.state // TODO check props

    return (
      <PopupPageLayout selectedIdx={selectedIdx} onPageChange={this.onPageChange}>
        {features.length
          ? features.map((f, i) => (
              <PopupDefaultPage
                key={i}
                title={f.get('title') || `Feature ${i+1}`}
                attributes={propertiesFilter(f.getProperties)}
                {...this.props}>
                <div style={{ padding: '10px' }}>No available actions</div>
              </PopupDefaultPage>
            ))
          : <PopupDefaultPage title={loading ? 'Loading features' : 'Select a feature'} {...this.props} />
        }
      </PopupPageLayout>
    )
  }
}

PopupInsert.defaultProps = {
  features: [],
  onClose: () => {},
  onSelectFeature: () => {},
  onSettingsClick: () => {},
  propertiesFilter: properties => properties,
  selectedIdx: 0,
  showSettingsCog: false
}

PopupInsert.propTypes = {
  /** array from which to select a feature */
  features: PropTypes.array,
  /** put ui into loading state */
  loading: PropTypes.bool,
  /** a reference to openlayers map object */
  map: PropTypes.object.isRequired,
  /** callback fired when popup closed with x button */
  onClose: PropTypes.func,
  /** fired whenever a new feature is selected */
  onSelectFeature: PropTypes.func,
  /** callback fired if no children passed and default page settings cog is clicked */
  onSettingsClick: PropTypes.func,
  /** filter properties displayed for a feature */
  propertiesFilter: PropTypes.func,
  /** index of currently selected page in popup */
  selectedIdx: PropTypes.number,
  /** reference to openlayers select interaction which can optionally be managed by IA */
  selectInteraction: PropTypes.object,
  /** show the settings cog -- use with onSettingsClick */
  showSettingsCog: PropTypes.bool
}

export default PopupInsert
