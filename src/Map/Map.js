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

    // this is used to create a unique identifier for the map div
    this.target = `_ol_kit_map_${nanoid(6)}`

    // create a map context
    MapContext = React.createContext()
  }

  componentDidMount () {
    const { map, onMapInit, updateUrlDebounce, updateUrlFromView, updateViewFromUrl, urlViewParam } = this.props
    const onMapReady = map => {
      // pass map back via callback
      onMapInit(map)
      // force update AFTER onMapInit to get this.map into the context
      this.forceUpdate()
    }

    // if no map was passed, create the map
    this.map = !map ? createMap({ target: this.target }) : map

    if (updateUrlFromView) {
      const setUrl = () => updateUrlFromMap(this.map, urlViewParam)
      const mapMoveListener = debounce(setUrl, updateUrlDebounce)

      // update the url param after map movements
      this.map.on('moveend', mapMoveListener)
    }

    if (updateViewFromUrl) {
      // read the url to update the map from view info
      updateMapFromUrl(this.map, urlViewParam)
        .catch(ugh.error)
        .finally(() => onMapReady(this.map)) // always fire callback with map reference on success/failure
    } else {
      // callback that returns a reference to the created map
      onMapReady(this.map)
    }
  }

  getContextValue = () => {
    return {
      map: this.map
    }
  }

  render () {
    const { children, fullScreen, style } = this.props

    return (
      <>
        <StyledMap
          id={this.target}
          fullScreen={fullScreen}
          style={style} />
        <MapContext.Provider value={this.getContextValue()}>
          {!this.map // wait for a map to exist before rendering children that need a ref to map
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
  urlViewParam: 'view',
  style: {}
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
  /** returns an initialized map object after optional animations complete */
  onMapInit: PropTypes.func,
  /** the length of debounce on map movements before the url gets updated */
  updateUrlDebounce: PropTypes.number,
  /** add map location coords + zoom level to url as query params */
  updateUrlFromView: PropTypes.bool,
  /** update map view based off the url param */
  updateViewFromUrl: PropTypes.bool,
  /** change the url param used to set the map location coords */
  urlViewParam: PropTypes.string,
  /** apply inline styles to the map container */
  style: PropTypes.object
}

export default Map
