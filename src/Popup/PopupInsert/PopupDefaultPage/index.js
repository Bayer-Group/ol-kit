import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { connectToMap } from 'Map'
import CloseIcon from '@material-ui/icons/Close';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { HeightContainer, AttributeSettings } from '../styled'
import ZmdiButton from '../_PopupZmdiButton'
import LoadingSpinner from '../_LoadingSpinner'
import DataList from '../PopupDataList'
import PopupTabs from '../PopupTabs'
import { Header, Body, Close, Title, FeatureNavigator, FeatureCount, HeaderDetails, Frame } from '../PopupHeader/styled'

/**
 * @component
 * @category Popup
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
      onSettingsClick,
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
          <Close onClick={onClose}><CloseIcon data-testid='popup-page-close' /></Close>
          {pageCount > 1 &&
            <FeatureNavigator>
              <ZmdiButton onClick={onPrevPage}>
                <ChevronLeftIcon fontSize='small' data-testid='popup-page-left-arrow' />
              </ZmdiButton>
              <FeatureCount>{`${currentPage} / ${pageCount}`}</FeatureCount>
              <ZmdiButton onClick={onNextPage}>
                <ChevronRightIcon fontSize='small' data-testid='popup-page-right-arrow' />
              </ZmdiButton>
            </FeatureNavigator>
          }
          <HeaderDetails loading={loading.toString()}>
            <Title>{title}</Title>
          </HeaderDetails>
        </Header>

        {loading
          ? (
            <LoadingSpinner style={{ marginTop: '70px', textAlign: 'center' }} />
          ) : (
            <Body>
              <PopupTabs selectedIdx={currentTab}>
                <div title={translations['_ol_kit.PopupDefaultPage.details']} style={{ height: '170px', overflowY: 'scroll' }}>
                  {onSettingsClick &&
                    <AttributeSettings onClick={onSettingsClick}>
                      <i className='zmdi zmdi-settings'></i>
                      <p style={{ fontSize: 'smaller', padding: '0px 5px', margin: 0 }}>{translations['_ol_kit.PopupDefaultPage.customize']}</p>
                    </AttributeSettings>
                  }
                  <DataList attributes={attributes} />
                </div>
                {childrenCount > 3
                  ? <Frame title={translations['_ol_kit.PopupDefaultPage.actions']} height={169}>
                    {children}
                  </Frame>
                  : <div title={translations['_ol_kit.PopupDefaultPage.actions']} style={{ height: '169px' }}>
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
  /** An object consisting of stringify-able key/value pairs */
  attributes: PropTypes.object,
  /** An array of components rendered in the actions tab */
  children: PropTypes.node,
  /** (passed by `PopupPageLayout`) The index of the currently shown page */
  currentPage: PropTypes.number,
  /** The index of the selected tab */
  currentTab: PropTypes.number,
  /** Render the page with a loading indicator and no details or actions */
  loading: PropTypes.bool,
  /** A callback fired when the close button is clicked */
  onClose: PropTypes.func,
  /** (passed by `PopupPageLayout`) Callback invoked when the next page should be shown */
  onNextPage: PropTypes.func,
  /** (passed by `PopupPageLayout`) Callback invoked when the previous page should be shown */
  onPrevPage: PropTypes.func,
  /** Set this callback to show settings cog */
  onSettingsClick: PropTypes.func,
  /** (passed by `PopupPageLayout`) Total number of pages */
  pageCount: PropTypes.number,
  /** The title shown centered in the top of the popup page */
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  /** Object with key/value pairs for translated strings */
  translations: PropTypes.shape({
    '_ol_kit.PopupDefaultPage.details': PropTypes.string,
    '_ol_kit.PopupDefaultPage.actions': PropTypes.string,
    '_ol_kit.PopupDefaultPage.customize': PropTypes.string
  }).isRequired
}

PopupDefaultPage.defaultProps = {
  onClose: () => {},
  children: [],
  loading: false,
  currentTab: 0,
  attributes: {}
}

export default connectToMap(PopupDefaultPage)
