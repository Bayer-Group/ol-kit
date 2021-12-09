import React from 'react'
import PropTypes from 'prop-types'
import en from 'locales/en'
import { ErrorBoundary } from 'ErrorBoundary'

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
      intialized: false,
      maps: [],
      syncView: null,
      syncedState: [],
      visibleState: [],
      visibleMapCount: 0
    }

    this.promises = []

    // create context when <MultiMapManager> is included in component tree
    MultiMapContext = React.createContext()
  }

  syncableMapListener = (map, e) => {
    const { synced, type } = e

    if (type === 'synced' && !synced) {
      // reset view of newly desynced map
      const view = this.state[map.getTargetElement().id].view

      map.setView(view)
    } else {
      this.setSyncedView(map)
    }
    this.forceUpdate()
  }

  setSyncedView = map => {
    const { syncedView } = this.state

    if (!syncedView) {
      // this is the first map, set the view in state
      this.setState({ syncedView: map.getView() })
    } else {
      map.setView(syncedView)
    }
  }

  addToContext = (config, addToContextProp = () => {}) => {
    const { map } = config
    const mapId = map.getTargetElement().id
    const synced = map.getSyncedState()
    const visible = map.getVisibleState()
    const mapConfig = {
      ...config,
      synced,
      visible,
      view: map.getView()
    }
    const newState = { ...this.state, [mapId]: mapConfig }

    // call original prop
    addToContextProp(config)
    this.setState({ ...newState })

    // attach listener
    const listener = e => this.syncableMapListener(map, e)

    map.on(['synced', 'visible'], listener)
    if (synced) this.setSyncedView(map)
  }

  onMapInitOverride = async (map, onMapInitProp = () => {}) => {
    const mapId = map.getTargetElement().id
    const maps = [...this.state.maps, map]

    this.setState({ maps })

    const promise = new Promise((resolve) => {
      // call original prop
      onMapInitProp(map)
      resolve()
    })

    this.promises.push(promise)
    // TODO maps are initializing more than once

    // if (maps.length === Object.keys(contextState).length) {
    //   const { groups } = this.props

    //   groups.forEach(groupIds => {
    //     // sync events by map groups
    //     const groupedViews = groupIds.map(id => contextState[id].map.getView())

    //     syncViewEvents(groupedViews)
    //   })
    // }
    if (maps.length === 4) {
      this.props.onMapsInit(maps)
      this.setState({ intialized: true })
      console.log('after onMapsInit')
      await Promise.all(this.promises)
      console.log('after Promise.all')
    }
  }

  getContextValue = () => {
    const { contextProps, translations } = this.props
    const { maps } = this.state
    const map = maps[0]
    console.log('getContextValue', map)

    return {
      ...this.state,
      map,
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
    const { intialized } = this.state
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
        // this allows the Maps to render and initialize first before all other comps
        return intialized ? child : null
      }
    })
  }

  render () {
    const adoptedChildren = this.childModifier(this.props.children)

    return (
      <ErrorBoundary floating={true}>
        <MultiMapContext.Provider value={this.getContextValue()}>
          {adoptedChildren}
        </MultiMapContext.Provider>
      </ErrorBoundary>
    )
  }
}

MultiMapManager.defaultProps = {
  contextProps: {},
  groups: [],
  onMapsInit: () => {},
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
  /** callback called with array of map objects after all multimaps have been created */
  onMapsInit: PropTypes.func,
  /** Object with key/value pairs for component translation strings */
  translations: PropTypes.object
}

export default MultiMapManager
