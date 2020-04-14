import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { HeightContainer } from '../styled'

/**
 * @component
 * @category Popup
 * @example ./example.md
 */
class PopupPageLayout extends Component {
  constructor (props) {
    super(props)

    this.state = {
      selectedIdx: props.selectedIdx
    }

    this.dataProp = this.dataProp.bind(this)
    this.nextPage = this.nextPage.bind(this)
    this.prevPage = this.prevPage.bind(this)
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps ({ selectedIdx }) {
    if (this.state.selectedIdx !== selectedIdx) this.setState({ selectedIdx })
  }

  // this method returns either the data prop passed to the child or the idx of the child
  dataProp (idx) {
    const child = this.props.children[idx]

    return child.props.data || idx
  }

  prevPage () {
    const currIdx = this.state.selectedIdx
    const nextIdx = this.state.selectedIdx - 1

    if (currIdx > 0) {
      // notify consumers that we're going back to the previous page
      this.props.onPageChange(this.dataProp(currIdx), this.dataProp(nextIdx))

      this.setState({ selectedIdx: nextIdx })
    }
  }

  nextPage () {
    const currIdx = this.state.selectedIdx
    const nextIdx = this.state.selectedIdx + 1
    const childLength = this.props.children.length

    if (nextIdx < childLength) {
      // notify consumers that we're advancing to the next page
      this.props.onPageChange(this.dataProp(currIdx), this.dataProp(nextIdx))

      this.setState({ selectedIdx: nextIdx })
    }
  }

  render () {
    const { children } = this.props
    const { selectedIdx } = this.state

    const childrenWithProps = React.Children.map(children, child =>
      React.cloneElement(child, {
        onNextPage: this.nextPage,
        onPrevPage: this.prevPage,
        pageCount: Array.isArray(children) ? children.length : 1,
        currentPage: selectedIdx + 1
      })
    )

    return (
      <HeightContainer data-testid={this.props['data-testid']}>
        {React.Children.toArray(childrenWithProps)[selectedIdx]}
      </HeightContainer>
    )
  }
}

PopupPageLayout.defaultProps = {
  children: [],
  'data-testid': undefined,
  selectedIdx: 0
}

PopupPageLayout.propTypes = {
  /** An array of components which are rendered as individual pages */
  children: PropTypes.node.isRequired,

   /** Internal prop used for testing */
  data-testid: PropTypes.string,

  /** The index of the currently shown page */
  selectedIdx: PropTypes.number,

  /** Callback fired when a user navigates the page layout or closes the popup. The callback is passed the current page index and the next page index or `null` if the popup was closed. If the children of the layout passed a `data` prop, this is passed instead of the index for easier consumption. */
  onPageChange: PropTypes.func
}

export default PopupPageLayout
