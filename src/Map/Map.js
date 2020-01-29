import React from 'react'
import PropTypes from 'prop-types'
import nanoid from 'nanoid'
import debounce from 'lodash.debounce'
import { StyledMap } from './styled'
import { createMap, updateMapFromUrl, updateUrlFromMap } from './utils'

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
    const { map, onMapInit, shouldUpdateUrl, shouldReadUrl, urlViewParam } = this.props

    if (!map) {
      // if no map was passed, create the map
      this.map = createMap({ target: this.target })
      // callback that returns a reference to the created map
      onMapInit(this.map)
      // force update to get this.map into the context
      this.forceUpdate()
    } else {
      this.map = map
    }

    if (shouldUpdateUrl) {
      const mapMoveListener = debounce(() => updateUrlFromMap(this.map, urlViewParam), 400)

      // update the url param after map movements
      this.map.on('moveend', mapMoveListener)
    }

    if (shouldReadUrl) {
      // read the url to update the map from view info
      updateMapFromUrl(this.map, urlViewParam)
        .then((e) => console.log('resolved!', e))
        .catch(console.error)
    }
  }

  getContextValue = () => {
    return {
      map: this.map
    }
  }

  render () {
    const { children, fullScreen } = this.props

    return (
      <>
        <StyledMap
          id={this.target}
          fullScreen={fullScreen} />
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
  shouldReadUrl: true,
  shouldUpdateUrl: true,
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
  /** returns an initialized map object if nothing was passed to the `map` prop */
  onMapInit: PropTypes.func,
  /** update map view based off the url param */
  shouldReadUrl: PropTypes.bool,
  /** add map location coords + zoom level to url as query params */
  shouldUpdateUrl: PropTypes.bool,
  /** change the url param used to set the map location coords */
  urlViewParam: PropTypes.string
}

export default Map
