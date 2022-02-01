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
      initialized: false,
      maps: [],
      syncedState: [],
      visibleState: [],
      visibleMapCount: 0
    }

    this.syncedView = null
    this.promisesResolvers = []

    // create context when <MultiMapManager> is included in component tree
    MultiMapContext = React.createContext()
  }

  componentDidMount () {
    window.addEventListener('resize', this.refreshMaps)
  }

  refreshMaps = () => {
    this.forceUpdate()
    // this refresh needs to fire after the component updates the map views
    setTimeout(() => this.state.maps.map(map => map.updateSize()), 0)
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

    this.refreshMaps()
  }

  setSyncedView = map => {
    if (!this.syncedView) {
      // this is the first map, set the view in state
      this.syncedView = map.getView()
    } else {
      map.setView(this.syncedView)
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
    const maps = [...this.state.maps, map]

    this.setState({ maps })

    const promise = new Promise((resolve) => {
      // call original prop
      onMapInitProp(map)
      this.promisesResolvers.push(resolve)
    })

    // check for that last time this is called & initialize
    if (maps.length === this.props.mapsConfig.length) this.initialize()

    return promise
  }

  initialize = async () => {
    const { maps } = this.state

    const { contextProps } = await this.props.onMapsInit(maps)
    // resolve all onMapInit promises now

    this.promisesResolvers.map(resolve => resolve())
    this.refreshMaps()
    this.setState({ initialized: true, ...contextProps })
  }

  getContextValue = () => {
    const { contextProps, translations } = this.props
    const { maps } = this.state
    const map = maps[0]

    return {
      map,
      onMapAdded: this.onMapAdded,
      onMapRemoved: this.onMapRemoved,
      syncedState: maps.map(m => m.getSyncedState()),
      translations,
      visibleState: maps.map(m => m.getVisibleState()),
      visibleMapCount: maps.map(m => m.getVisibleState()).filter(e => e).length,
      ...contextProps,
      // We need to spread state last so that translations and other contextProps provided
      // from onMapsInit are not shadowed by any defaultProps
      ...this.state
    }
  }

  childModifier = rawChildren => {
    const { initialized } = this.state
    const children = !Array.isArray(rawChildren) ? [rawChildren] : rawChildren
    const adoptedChildren = children.map((child, i) => {
      // only render FlexMap & FullScreenFlex until initialized
      const allow = initialized || child.props.disableAsyncRender

      if (child?.props?.isMultiMap) {
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
        return allow && React.cloneElement(child, { ...child.props }, [this.childModifier(child.props.children)])
      } else {
        // this allows the Maps to render and initialize first before all other comps
        return allow ? child : null
      }
    })

    return adoptedChildren
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
  /** Array of map config objects */
  mapsConfig: PropTypes.array.isRequired,
  /** callback called with array of map objects after all multimaps have been created */
  onMapsInit: PropTypes.func,
  /** Object with key/value pairs for component translation strings */
  translations: PropTypes.object
}

export default MultiMapManager
