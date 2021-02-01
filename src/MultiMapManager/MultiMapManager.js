import React from 'react'
import PropTypes from 'prop-types'
import en from 'locales/en'
import { syncMapEvents } from './utils'
import ugh from 'ugh'

import { FlexMap, FullScreenFlex } from './styled'

// context is only created when <MultiMapManager> is implemented (see constructor)
export let MultiMapContext = false
const contextState = {}

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

  addToContext = (config, addToContextProp = () => {}) => {
    const mapId = config.map.getTargetElement().id

    contextState[mapId] = {...config}

    // call original prop
    addToContextProp(config)
  }

  getContextValue = () => {
    const { contextProps } = this.props

    return {
      ...contextState,
      ...contextProps
    }
  }

  componentDidMount() {
    const { groups, multiMapConfig } = this.props
    const entries = Object.entries(multiMapConfig)

    if (entries.length) {
      groups.forEach(groupIds => {
        // sync events by map groups
        const groupedMaps = groupIds.map(id => multiMapConfig[id])
  
        syncMapEvents(groupedMaps)
      })
    }
  }

  render () {
    const { multiMapConfig } = this.props
    const childModifier = children => children.map(child => {
      if (child?.props?._ol_kit_multi) {
        // catch for multi map children
        const propOverride = config => this.addToContext(config, child.props.addMapToContext)
        const adoptedChild = React.cloneElement(child, { addMapToContext: propOverride })

        return adoptedChild
      } else if (Array.isArray(child)) {
        // child is an array of children
        return childModifier(child)
      } else if (child?.props?.children) {
        // loop through children of children
        return childModifier([child.props.children])
      } else {
        return child
      }
    })
    const adoptedChildren = childModifier(this.props.children)

    return (
      <MultiMapContext.Provider value={this.getContextValue()}>
        <FullScreenFlex>
          {adoptedChildren}
          {/* {entries.map(([key, map], i) => {
            return (
              <FlexMap index={i} total={entries.length} key={key}>
                <Map
                  map={map}
                  key={key} />
              </FlexMap>
            )
          })} */}
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
