import React from 'react'
import PropTypes from 'prop-types'
import en from 'locales/en'
import { syncViewEvents } from './utils'

// context is only created when <MultiMapManager> is implemented (see constructor)
export let MultiMapContext = null

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
      maps: [],
      syncedState: [],
      visibleState: [],
      visibleMapCount: 0
    }

    // create context when <MultiMapManager> is included in component tree
    MultiMapContext = React.createContext()
  }

  syncableMapListener = e => {
    const { synced, type, visible } = e

    console.log('syncableMapListener', type)
    this.forceUpdate()
  }

  addToContext = (config, addToContextProp = () => {}) => {
    const { map } = config
    const mapId = map.getTargetElement().id
    const mapConfig = {
      ...config,
      synced: map.getSyncedState(),
      visible: map.getVisibleState()
    }
    const newState = { ...this.state, [mapId]: mapConfig}

    map.on(['synced', 'visible'], this.syncableMapListener)

    // call original prop
    addToContextProp(config)
    this.setState({ ...newState })
  }

  onMapInitOverride = (map, onMapInitProp = () => {}) => {
    const mapId = map.getTargetElement().id
    const maps = [...this.state.maps, map]

    this.setState({ maps })

    // call original prop
    onMapInitProp(map)
    // TODO maps are initializing more than once

    // if (maps.length === Object.keys(contextState).length) {
    //   const { groups } = this.props

    //   groups.forEach(groupIds => {
    //     // sync events by map groups
    //     const groupedViews = groupIds.map(id => contextState[id].map.getView())

    //     syncViewEvents(groupedViews)
    //   })
    // }
  }

  getContextValue = () => {
    const { contextProps, translations } = this.props
    const { maps } = this.state
    console.log('contextValue',  {
      ...this.state,
      syncedState: maps.map(m => m.getSyncedState()),
      visibleState: maps.map(m => m.getVisibleState()),
      visibleMapCount: maps.map(m => m.getVisibleState()).filter(e => e).length,
      ...contextProps
    })

    return {
      ...this.state,
      onMapAdded: this.onMapAdded,
      onMapRemoved: this.onMapRemoved,
      syncedState: maps.map(m => m.getSyncedState()),
      translations,
      visibleState: maps.map(m => m.getVisibleState()),
      visibleMapCount: maps.map(m => m.getVisibleState()).filter(e => e).length,
      ...contextProps
    }
  }

  childModifier = rawChildren => {
    const children = !Array.isArray(rawChildren) ? [rawChildren] : rawChildren

    return children.map((child, i) => {
      if (child.props.isMultiMap) {
        // we caught a map
        const addToContextOverride = config => this.addToContext(config, child.props.addMapToContext)
        const onMapInitOverride = map => this.onMapInitOverride(map, child.props.onMapInit)
        const propsOverride = {
          ...child.props,
          addMapToContext: addToContextOverride,
          onMapInit: onMapInitOverride,
          _ol_kit_context_id: child.props.id,
          isMultiMap: true,
          key: i,
          map: null // important so <Map> creates a SyncableMap
        }
        const adoptedChild = React.cloneElement(child, propsOverride)

        return adoptedChild
      } else if (Array.isArray(child)) {
        // child is an array of children
        return this.childModifier(child)
      } else if (child?.props?.children) {
        // loop through children of children
        return React.cloneElement(child, { ...child.props }, [this.childModifier(child.props.children)])
      } else {
        return child
      }
    })
  }

  render () {
    const adoptedChildren = this.childModifier(this.props.children)

    return (
      <MultiMapContext.Provider value={this.getContextValue()}>
        {adoptedChildren}
      </MultiMapContext.Provider>
    )
  }
}

MultiMapManager.defaultProps = {
  contextProps: {},
  groups: [],
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
