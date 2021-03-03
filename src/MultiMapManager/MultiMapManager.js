import React from 'react'
import PropTypes from 'prop-types'
import en from 'locales/en'
import { syncViewEvents } from './utils'

// context is only created when <MultiMapManager> is implemented (see constructor)
export let MultiMapContext = null
const contextState = {}
const multiMaps = []

/**
 * A higher order component that manages MultiMapContext for connectToContext wrapped children
 * @component
 * @category MultiMap
 * @since 1.7.0
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

    contextState[mapId] = { ...config }

    // call original prop
    addToContextProp(config)
    this.forceUpdate()
  }

  onMapInitOverride = (map, onMapInitProp = () => {}) => {
    const mapId = map?.getTargetElement()?.id

    multiMaps.push(mapId)

    // call original prop
    onMapInitProp(map)
    // TODO maps are initializing more than once

    if (multiMaps.length === Object.keys(contextState).length) {
      const { groups } = this.props

      groups.forEach(groupIds => {
        // sync events by map groups
        const groupedViews = groupIds.map(id => contextState[id].map.getView())

        syncViewEvents(groupedViews)
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

      return children.map((child, i) => {
        if (child.props.isMultiMap) {
          // we caught a map
          const propOverride = config => this.addToContext(config, child.props.addMapToContext)
          const onMapInitOverride = map => this.onMapInitOverride(map, child.props.onMapInit)
          const propsOverride = {
            ...child.props,
            addMapToContext: propOverride,
            onMapInit: onMapInitOverride,
            _ol_kit_context_id: child.props.id,
            map: null,
            key: i
          }
          const adoptedChild = React.cloneElement(child, propsOverride)

          return adoptedChild
        } else if (Array.isArray(child)) {
          // child is an array of children
          return childModifier(child)
        } else if (child?.props?.children) {
          // loop through children of children
          return React.cloneElement(child, { ...child.props }, [childModifier(child.props.children)])
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
  /** Nested arrays of ids grouped together to syncronize events across multiple maps */
  groups: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
  /** Object with key/value pairs for component translation strings */
  translations: PropTypes.object
}

export default MultiMapManager
