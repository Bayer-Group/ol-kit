import React from 'react'
import PropTypes from 'prop-types'
import en from 'locales/en'
import ugh from 'ugh'

// context is always created but works without requiring a mounted <Provider>
export const ProviderContext = React.createContext()

/**
 * @component
 * @category Provider
 * @example ./example.md
 * @since 0.10.0
 */
class Provider extends React.Component {
  constructor (props) {
    super(props)

    // state becomes an object of persistedStateKeys (or component names) with their persisted states'
    this.state = {
      contextProps: {}
    }
  }

  persistState = (persistedState, persistedStateKey) => {
    if (!persistedStateKey || typeof persistedStateKey !== 'string') return ugh.error('persistedStateKey (string; usually "ComponentName") must be passed as second arg to persistState(state, persistedStateKey)') // eslint-disable-line no-console

    this.setState({ [persistedStateKey]: persistedState })
  }

  setContextProps = contextProps => {
    this.setState({ contextProps })
  }

  getContextValue = () => {
    const props = { ...this.props, ...this.state.contextProps }
    const { contextProps, map: mapProp, maps: mapsProp, translations } = props

    // if (!mapProp && !mapsProp.length) return ugh.throw('Provider requires either a \'map\' or \'maps\' prop to work!')

    // support multi-map components
    // default map reference to zeroith map from mapsProp if an array of maps has been passed
    const map = mapsProp.length ? mapsProp[0] : mapProp
    // default an array with single value of map prop if maps array has not been passed
    const maps = mapsProp.length ? mapsProp : [mapProp]

    return {
      map,
      maps,
      persistedState: this.state,
      persistState: this.persistState,
      ProviderContext,
      setContextProps: this.setContextProps,
      translations,
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
  /** Add any custom props to context and they will be passed to all components wrapped by connectToContext */
  contextProps: PropTypes.object,
  /** OL map object (required if maps array is not passed) */
  map: PropTypes.object,
  /** Array of Openlayers map objects for components that support multi-map (this will override anything passed to map prop) */
  maps: PropTypes.array,
  /** Object with key/value pairs for component translation strings */
  translations: PropTypes.object
}

export default Provider
