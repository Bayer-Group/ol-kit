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
class PopupDefaultInsert extends Component {
  constructor (props) {
    super(props)

    this.state = {
      selectedIdx: 0
    }
  }

  componentDidMount () {
    const { features } = this.props

    if (features.length) {
      this.setState({ selectedIdx: 0 })
      this.selectFeature(features[0])
    }
  }

  UNSAFE_componentWillReceiveProps (nextProps) { // eslint-disable-line camelcase
    const selectedIdx = typeof nextProps.selectedIdx === 'number' ? nextProps.selectedIdx : this.state.selectedIdx

    if (selectedIdx !== this.state.selectedIdx) {
      // if props update paging/selected feature, keep state in sync
      this.onPageChange(this.state.selectedIdx, selectedIdx)
    }
    if (nextProps.features.length && nextProps.features.length !== this.props.features.length) {
      this.selectFeature(nextProps.features[selectedIdx])
    }
  }

  selectFeature = feature => {
    const { selectInteraction } = this.props
    const deselected = selectInteraction.getFeatures().getArray()
    const selected = [feature]
    const event = new olSelect.Event('select', selected, deselected)

    // clear the previously selected feature before adding newly selected feature so only one feature is "selected" at a time
    selectInteraction.getFeatures().clear()
    selectInteraction.getFeatures().push(feature)
    selectInteraction.dispatchEvent(event)

    this.props.onSelectFeature(feature, this.state.selectedIdx)
  }

  onPageChange = (currIdx, nextIdx) => {
    const { features } = this.props

    if (features.length) {
      // select new feature when paging & update state
      this.selectFeature(features[nextIdx])
      this.setState({ selectedIdx: nextIdx })
    }
  }

  render () {
    const { features, loading, onClose, onSettingsClick, propertiesFilter, showSettingsCog, translations } = this.props
    const { selectedIdx } = this.state

    return (
      <PopupPageLayout selectedIdx={selectedIdx} onPageChange={this.onPageChange} data-testid='popup-insert-default'>
        {features.length
          ? features.map((f, i) => {
              // priority: 'title', 'name', then 'Feature x'
              const attributes = f.getProperties()
              let title = `Feature ${i+1}`

              for (const key in attributes) {
                if (key.toLowerCase() === 'name') title = attributes[key]
                if (key.toLowerCase() === 'title') title = attributes[key]
              }

              return (
                <PopupDefaultPage
                  key={i}
                  title={title}
                  loading={loading}
                  onClose={onClose}
                  attributes={propertiesFilter(f.getProperties())}
                  translations={translations}>
                  <div style={{ padding: '10px' }}>No available actions</div>
                </PopupDefaultPage>
              )
            })
          : <PopupDefaultPage
            title={loading ? 'Loading features' : 'Select a feature'}
            loading={loading}
            onClose={onClose}
            translations={translations} />
        }
      </PopupPageLayout>
    )
  }
}

PopupDefaultInsert.defaultProps = {
  features: [],
  onClose: () => {},
  onSelectFeature: () => {},
  onSettingsClick: () => {},
  propertiesFilter: properties => properties,
  showSettingsCog: false
}

PopupDefaultInsert.propTypes = {
  /** array from which to select a feature */
  features: PropTypes.array,
  /** put ui into loading state */
  loading: PropTypes.bool,
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
  /** reference to openlayers select interaction which */
  selectInteraction: PropTypes.object.isRequired,
  /** show the settings cog -- use with onSettingsClick */
  showSettingsCog: PropTypes.bool,
  /** object with key/value pairs for translated strings */
  translations: PropTypes.shape({
    '_ol_kit.PopupDefaultPage.details': PropTypes.string,
    '_ol_kit.PopupDefaultPage.actions': PropTypes.string,
    '_ol_kit.PopupDefaultPage.customize': PropTypes.string
  }).isRequired
}

export default connectToMap(PopupDefaultInsert)
