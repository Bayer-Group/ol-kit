import React from 'react'
import PropTypes from 'prop-types'
import en from 'locales/en'
import { syncMapEvents } from './utils'

// context is only created when <MultiMapManager> is implemented (see constructor)
export let MultiMapContext = false
const contextState = {}
const multiMaps = []

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
      mapContext: {},
      mapInitialized: false
    }

    // create context when <MultiMapManager> is included in component tree
    MultiMapContext = React.createContext()
  }

  addToContext = (config, addToContextProp = () => {}) => {
    const mapId = config.map.getTargetElement().id
    // console.log('addToContext', mapId)

    contextState[mapId] = {...config}

    // call original prop
    addToContextProp(config)
    this.forceUpdate()
  }

  onMapInitOverride = (map, onMapInitProp = () => {}) => {
    const mapId = map.getTargetElement().id

    multiMaps.push(mapId)

    // call original prop
    onMapInitProp(map)
    // TODO maps are initializing more than once

    if (multiMaps.length === Object.keys(contextState).length) {
      const { groups } = this.props
      // console.log('MulitMapManager INIT')

      groups.forEach(groupIds => {
        // console.log('groupIds', groupIds)
        // sync events by map groups
        const groupedMaps = groupIds.map(id => contextState[id].map)
  
        syncMapEvents(groupedMaps)
      })
    }
  }

  getContextValue = () => {
    const { contextProps } = this.props

    return {
      ...contextState,
      ...contextProps
    }
  }

  render () {
    const childModifier = rawChildren => {
      const children = !Array.isArray(rawChildren) ? [rawChildren] : rawChildren

      return children.map(child => {
        if (child?.props?._ol_kit_multi) {
          // we caught a map
          // catch for multi map children
          const grandChildren = React.cloneElement(child.props.children, { _ol_kit_context_id: child.props.id }) // this explicit _ol_kit_context_id prop no longer necessary
          const propOverride = config => this.addToContext(config, child.props.addMapToContext)
          const onMapInitOverride = map => this.onMapInitOverride(map, child.props.onMapInit)
          const adoptedChild = React.cloneElement(child, { addMapToContext: propOverride, onMapInit: onMapInitOverride, _ol_kit_context_id: child.props.id, map: null }, [grandChildren])

          return adoptedChild
        } else if (Array.isArray(child)) {
          // child is an array of children
          return childModifier(child)
        } else if (child?.props?.children) {
          // loop through children of children
          return React.cloneElement(child, {}, [childModifier([child.props.children])]) // this hardcode to array might be a problem
        } else {
          return child
        }
      })
    }
    const adoptedChildren = childModifier(this.props.children)

    return (
      <MultiMapContext.Provider value={this.getContextValue()}>
        {adoptedChildren}
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
