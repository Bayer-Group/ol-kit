import React from 'react'
import PropTypes from 'prop-types'
import nanoid from 'nanoid'
import en from 'locales/en'
import ugh from 'ugh'

// context is only created when <Provider> is implemented (see constructor)
export let ProviderContext = {}

// TODO reenable this documentation once multi-map is available (add /** below)
/* A higher order component that provides context to connectToContext wrapped children
 * @component
 * @example ./example.md
 * @category Provider
 * @since 1.0.0
 */
class Provider extends React.Component {
  constructor (props) {
    super(props)
    console.log('CONSTRUCT')

    const mapId = `_ol_kit_map_${nanoid(6)}`
    // create context when <Provider> is included in component tree
    ProviderContext[mapId] = React.createContext()

    // state becomes an object of persistedStateKeys (or component names) with their persisted states'
    this.state = {
      mapContext: {},
      mapId
    }
  }

  persistState = (persistedState, persistedStateKey) => {
    if (!persistedStateKey || typeof persistedStateKey !== 'string') return ugh.error('persistedStateKey (string; usually "ComponentName") must be passed as second arg to persistState(state, persistedStateKey)') // eslint-disable-line no-console

    this.setState({ [persistedStateKey]: persistedState })
  }

  addMapToContext = mapContext => {

    this.setState({ mapContext: { ...mapContext, ...this.state.mapId }})
  }

  getContextValue = () => {
    const { contextProps, map: mapProp, maps: mapsProp, translations } = this.props

    // if (!mapProp && !mapsProp.length) return ugh.throw('Provider requires either a \'map\' or \'maps\' prop to work!')

    // support multi-map components
    // default map reference to zeroith map from mapsProp if an array of maps has been passed
    const map = mapsProp.length ? mapsProp[0] : mapProp
    // default an array with single value of map prop if maps array has not been passed
    const maps = mapsProp.length ? mapsProp : [mapProp]
    console.log('mapcontext', this.state.mapContext)

    return {
      addMapToContext: this.addMapToContext,
      map,
      maps,
      persistedState: this.state,
      persistState: this.persistState,
      translations,
      ...this.state.mapContext,
      ...contextProps,
    }
  }

  render () {
    console.log('Provider render', Object.keys(ProviderContext))
    const Wrapper = ProviderContext[this.state.mapId]

    return (
      !Object.keys(ProviderContext).length
        ? this.props.children
        : (
          <Wrapper.Provider value={this.getContextValue()}>
            {this.props.children}
          </Wrapper.Provider>
        )
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
