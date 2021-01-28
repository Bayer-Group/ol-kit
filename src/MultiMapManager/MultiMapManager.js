import React from 'react'
import PropTypes from 'prop-types'
import en from 'locales/en'
import Map from '../Map/Map'
import { syncMapEvents } from './utils'
import ugh from 'ugh'

import { FlexMap, FullScreenFlex } from './styled'

// context is only created when <MultiMapManager> is implemented (see constructor)
export let MultiMapContext = null

/* A higher order component that provides context to connectToContext wrapped children
 * @component
 * @example ./example.md
 * @category MultiMap
 * @since 1.6.0
 */
class MultiMapManager extends React.Component {
  constructor (props) {
    super(props)

    // state becomes an object of persistedStateKeys (or component names) with their persisted states'
    this.state = {
      mapContext: {}
    }

    // create context when <MultiMapManager> is included in component tree
    MultiMapContext = React.createContext()
  }

  getContextValue = () => {
    const { contextProps, map: mapProp, maps: mapsProp, translations } = this.props

    // if (!mapProp && !mapsProp.length) return ugh.throw('MultiMapManager requires either a \'map\' or \'maps\' prop to work!')

    // support multi-map components
    // default map reference to zeroith map from mapsProp if an array of maps has been passed
    const map = mapsProp.length ? mapsProp[0] : mapProp
    // default an array with single value of map prop if maps array has not been passed
    const maps = mapsProp.length ? mapsProp : [mapProp]

    return {
      // addMapToContext: this.addMapToContext,
      map,
      maps,
      // persistedState: this.state,
      // persistState: this.persistState,
      translations,
      ...this.state.mapContext,
      ...contextProps
    }
  }

  componentDidMount() {
    const { groups, multiMapConfig } = this.props

    groups.forEach(groupIds => {
      // sync events by map groups
      const groupedMaps = groupIds.map(id => multiMapConfig[id])

      syncMapEvents(groupedMaps)
    })
  }

  render () {
    const { multiMapConfig } = this.props

    return (
      <MultiMapContext.Provider value={this.getContextValue()}>
        <FullScreenFlex>
          {Object.entries(multiMapConfig).map(([key, map], i) => {
            return (
              <FlexMap index={i} total={Object.entries(multiMapConfig).length} key={key}>
                <Map
                  key={key} />
              </FlexMap>
            )
          })}
        </FullScreenFlex>
      </MultiMapContext.Provider>
    )
  }
}

MultiMapManager.defaultProps = {
  contextProps: {},
  maps: [],
  translations: en
}

MultiMapManager.propTypes = {
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
  multiMapConfig: PropTypes.shape({
    key: PropTypes.object
  }),
  /** Object with key/value pairs for component translation strings */
  translations: PropTypes.object
}

export default MultiMapManager











  // persistState = (persistedState, persistedStateKey) => {
  //   if (!persistedStateKey || typeof persistedStateKey !== 'string') return ugh.error('persistedStateKey (string; usually "ComponentName") must be passed as second arg to persistState(state, persistedStateKey)') // eslint-disable-line no-console

  //   this.setState({ [persistedStateKey]: persistedState })
  // }

  // addMapToContext = mapContext => {
  //   this.setState({ mapContext })
  // }
