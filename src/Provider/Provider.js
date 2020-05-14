import React from 'react'
import PropTypes from 'prop-types'
import en from 'locales/en'
import ugh from 'ugh'

// context should only be created when <Provider> is mounted (see constructor), otherwise it's null so vmc child comps don't use context
export let ProviderContext = null

/**
 * @component
 * @category Provider
 * @example ./example.md
 * @since 0.7.0
 */
class Provider extends React.Component {
  constructor (props) {
    super(props)

    // state becomes an object of persistedStateKeys (or component names) with their persisted states'
    this.state = {}

    // create a provider context to manage/persist state of vmc children (only if <Provider> is mounted)
    ProviderContext = React.createContext()
  }

  persistState = (persistedState, persistedStateKey) => {
    if (!persistedStateKey || typeof persistedStateKey !== 'string') return ugh.error('persistedStateKey (string; usually "ComponentName") must be passed as second arg to persistState(state, persistedStateKey)') // eslint-disable-line no-console

    this.setState({ [persistedStateKey]: persistedState })
  }

  getContextValue = () => {
    const { contextProps, map: mapProp, maps: mapsProp, translations } = this.props

    if (!mapProp && !mapsProp.length) return ugh.throw('Provider requires either a \'map\' or \'maps\' prop to work!')

    // support multi-map components
    // default map reference to zeroith map from mapsProp if an array of maps has been passed
    const map = mapsProp.length ? mapsProp[0] : mapProp
    // default an array with single value of map prop if maps array has not been passed
    const maps = mapsProp.length ? mapsProp : [mapProp]

    return {
      map,
      maps,
      translations,
      persistedState: this.state,
      persistState: this.persistState,
      ...contextProps
    }
  }

  render () {
    return (
      <ProviderContext.Provider value={this.getContextValue()}>
        {this.props.children}
      </ProviderContext.Provider>
    )
  }
}

Provider.defaultProps = {
  contextProps: {},
  maps: [],
  translations: en
}

Provider.propTypes = {
  /** Pass components as children of Provider component */
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  /** Add any custom props to context and they will be passed to any component wrapped by connectToContext */
  contextProps: PropTypes.object,
  /** OL map object (required if maps array is not passed) */
  map: PropTypes.object,
  /** Array of Openlayers map objects for components that support multi-map (this will override anything passed to map prop) */
  maps: PropTypes.array,
  /** Object with key/value pairs for component translation strings */
  translations: PropTypes.object
}

export default Provider
