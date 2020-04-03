import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { HeightContainer } from 'vmc/popup/styled'

/**
 * @component
 * @category vmc
 * @example ./example.md
 */
class PopupPageLayoutChild extends Component {
  render () {
    return (
      <HeightContainer>
        {this.props.children}
      </HeightContainer>
    )
  }
}

PopupPageLayoutChild.propTypes = {
  /** (passed by `PopupPageLayout`) Callback invoked when the next page should be shown */
  onNextPage: PropTypes.func,

  /** (passed by `PopupPageLayout`) Callback invoked when the previous page should be shown */
  onPrevPage: PropTypes.func,

  /** (passed by `PopupPageLayout`) Total number of pages */
  pageCount: PropTypes.number,

  /** (passed by `PopupPageLayout`) The index of the currently shown page */
  currentPage: PropTypes.number,

  /** An array of components to render */
  children: PropTypes.node.isRequired
}

export default PopupPageLayoutChild
