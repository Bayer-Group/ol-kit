import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { SearchContainer, PlaceSearchInput } from './styled'

import { connectToContext } from 'Provider'

/**
 * @component
 * @category PlaceSearch
 * @since 1.3.0
 */
class PlaceSearch extends Component {
  handleChange = (_, activeIndex) => {
    this.setState({ activeIndex })
  }

  togglePanel = () => {
    this.setState({ showPanel: !this.state.showPanel })
  }

  hideLayerPanel = () => {
    this.setState({ showPanel: false })
  }

  render () {
    return (
      <SearchContainer>
        <PlaceSearchInput placeholder='Search for places, data or coords' />
      </SearchContainer>
    )
  }
}

PlaceSearch.defaultProps = {}

PlaceSearch.propTypes = {
  /** Object with key/value pairs for translated strings */
  translations: PropTypes.object
}

export default connectToContext(PlaceSearch)
