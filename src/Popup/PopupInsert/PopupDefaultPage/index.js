import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { HeightContainer, AttributeSettings } from '../styled'
import ZmdiButton from '../_PopupZmdiButton'
import LoadingSpinner from '../_LoadingSpinner'
import DataList from '../PopupDataList'
import PopupTabs from '../PopupTabs'
import { Header, Body, Close, Title, FeatureNavigator, FeatureCount, HeaderDetails, Frame } from '../PopupHeader/styled'

/**
 * @component
 * @category vmc
 * @example ./example.md
 */
class PopupDefaultPage extends Component {
  render () {
    const {
      translations,
      title,
      loading,
      currentTab,
      attributes,
      children,
      onNextPage,
      onPrevPage,
      pageCount,
      currentPage,
      onClose,
      showCustomizeDetails
    } = this.props

    const isReactFragment = child => {
      try {
        return child.type.toString() === React.Fragment.toString()
      } catch (e) {
        return false
      }
    }

    // Sometimes an IA will supply a React.Fragment as the children properties. The fragment could contain multiple
    // Action Items. A fragment child element won't have a length, we so need to check the fragment's children.
    const childrenCount = isReactFragment(children) ? children.props.children.length : children.length

    return (
      <HeightContainer>
        <Header>
          <Close onClick={onClose}><i className='zmdi zmdi-close'></i></Close>
          {pageCount > 1 &&
            <FeatureNavigator>
              <ZmdiButton onClick={onPrevPage}>
                <i className='zmdi zmdi-chevron-left'></i>
              </ZmdiButton>
              <FeatureCount>{`${currentPage} / ${pageCount}`}</FeatureCount>
              <ZmdiButton onClick={onNextPage}>
                <i className='zmdi zmdi-chevron-right'></i>
              </ZmdiButton>
            </FeatureNavigator>
          }
          <HeaderDetails loading={loading}>
            <Title>{title}</Title>
          </HeaderDetails>
        </Header>

        {loading
          ? (
            <LoadingSpinner style={{ marginTop: '70px', textAlign: 'center' }} />
          ) : (
            <Body>
              <PopupTabs selectedIdx={currentTab}>
                <div title={translations['olKit.PopupDefaultPage.details']} style={{ height: '170px', overflowY: 'scroll' }}>
                  { showCustomizeDetails &&
                    <AttributeSettings onClick={this.props.onSettingsClick}>
                      <i className='zmdi zmdi-settings'></i>
                      <p style={{ fontSize: 'smaller', padding: '0px 5px', margin: 0 }}>{translations['olKit.PopupDefaultPage.customize']}</p>
                    </AttributeSettings>
                  }
                  <DataList attributes={attributes} />
                </div>
                {childrenCount > 3
                  ? <Frame title={translations['olKit.PopupDefaultPage.actions']} height={169}>
                    {children}
                  </Frame>
                  : <div title={translations['olKit.PopupDefaultPage.actions']} style={{ height: '169px' }}>
                    {children}
                  </div>
                }
              </PopupTabs>
            </Body>
          )
        }
      </HeightContainer>
    )
  }
}

PopupDefaultPage.propTypes = {

  translations: PropTypes.object,

  /** The title shown centered in the top of the popup page */
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,

  /** Render the page with a loading indicator and no details or actions */
  loading: PropTypes.bool,

  /** The index of the selected tab */
  currentTab: PropTypes.number,

  /** An object consisting of stringify-able key/value pairs */
  attributes: PropTypes.object.isRequired,

  /** (passed by `PopupPageLayout`) Callback invoked when the next page should be shown */
  onNextPage: PropTypes.func,

  /** (passed by `PopupPageLayout`) Callback invoked when the previous page should be shown */
  onPrevPage: PropTypes.func,

  /** (passed by `PopupPageLayout`) Total number of pages */
  pageCount: PropTypes.number,

  /** (passed by `PopupPageLayout`) The index of the currently shown page */
  currentPage: PropTypes.number,

  /** An array of components rendered in the actions tab */
  children: PropTypes.node,

  /** A callback fired when the close button is clicked */
  onClose: PropTypes.func.isRequired,

  /** Opens up the settings modal */
  onSettingsClick: PropTypes.func,

  /** Shows the customize details button in popup details */
  showCustomizeDetails: PropTypes.bool
}

PopupDefaultPage.defaultProps = {
  onClose: () => {},
  children: [],
  loading: false,
  currentTab: 0,
  attributes: {},
  showCustomizeDetails: false,
  translations: {
    'olKit.PopupDefaultPage.details': 'Details',
    'olKit.PopupDefaultPage.actions': 'Actions',
    'olKit.PopupDefaultPage.customize': 'Customize Details'
  }
}

export default PopupDefaultPage
