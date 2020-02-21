import React from 'react'
import PropTypes from 'prop-types'
import nanoid from 'nanoid'
import debounce from 'lodash.debounce'
import { StyledMap } from './styled'
import { createMap, updateMapFromUrl, updateUrlFromMap } from './utils'
import ugh from 'ugh'

// context should only be created when <Map> is mounted (see constructor), otherwise it's null so child comps don't use context
export let MapContext = null

/**
 * A Reactified ol.Map wrapper component
 * @component
 * @category Map
 * @since 0.1.0
 */
class Map extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      map: null
    }

    // this is used to create a unique identifier for the map div
    this.target = `_ol_kit_map_${nanoid(6)}`

    // create a map context
    MapContext = React.createContext()
  }

  componentDidMount () {
    const { map: passedMap, onMapInit, updateUrlDebounce, updateUrlFromView, updateViewFromUrl, urlViewParam } = this.props

    // if no map was passed, create the map
    const map = !passedMap ? createMap({ target: this.target }) : passedMap
    const onMapReady = map => {
      // pass map back via callback prop
      const initCallback = onMapInit(map)
      // if a promise is returned from onMapInit, render children after it's resolved
      const isPromise = !!initCallback && typeof initCallback.then === 'function'

      // update AFTER onMapInit to get map into the state/context
      isPromise
        ? initCallback.then(() => this.setState({ map }))
        : this.setState({ map })
    }

    if (updateUrlFromView) {
      const setUrl = () => updateUrlFromMap(map, urlViewParam)
      const mapMoveListener = debounce(setUrl, updateUrlDebounce)

      // update the url param after map movements
      map.on('moveend', mapMoveListener)
    }

    if (updateViewFromUrl) {
      // read the url to update the map from view info
      updateMapFromUrl(map, urlViewParam)
        .catch(ugh.error)
        .finally(() => onMapReady(map)) // always fire callback with map reference on success/failure
    } else {
      // callback that returns a reference to the created map
      onMapReady(map)
    }
  }

  getContextValue = () => {
    const { map } = this.state

    return {
      map
    }
  }

  render () {
    const { children, fullScreen, style } = this.props
    const { map } = this.state

    return (
      <>
        <StyledMap
          id={this.target}
          fullScreen={fullScreen} />
        <MapContext.Provider value={this.getContextValue()}>
          {!map // wait for a map to exist before rendering children that need a ref to map
            ? null
            : children}
        </MapContext.Provider>
      </>
    )
  }
}

Map.defaultProps = {
  fullScreen: false,
  map: null,
  onMapInit: () => {},
  updateUrlDebounce: 400,
  updateUrlFromView: true,
  updateViewFromUrl: true,
  urlViewParam: 'view'
}

Map.propTypes = {
  /** any ol-kit children components will automatically be passed a reference to the map object via the `map` prop */
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  /** if this is set to false, the map will fill it's parent container */
  fullScreen: PropTypes.bool,
  /** optionally pass a custom map */
  map: PropTypes.object,
  /** callback called with initialized map object after optional animations complete
    note: if a <Promise> is returned from this function, Map will wait for onMapInit to resolve before rendering children
  */
  onMapInit: PropTypes.func,
  /** the length of debounce on map movements before the url gets updated */
  updateUrlDebounce: PropTypes.number,
  /** add map location coords + zoom level to url as query params */
  updateUrlFromView: PropTypes.bool,
  /** update map view based off the url param */
  updateViewFromUrl: PropTypes.bool,
  /** change the url param used to set the map location coords */
  urlViewParam: PropTypes.string
}

export default Map
