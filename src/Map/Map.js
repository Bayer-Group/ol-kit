import React from 'react'
import PropTypes from 'prop-types'
import nanoid from 'nanoid'
import debounce from 'lodash.debounce'

import MapLogo from './MapLogo'
import { createMap, createSelectInteraction, updateMapFromUrl, updateUrlFromMap } from './utils'
import { StyledMap } from './styled'
import en from 'locales/en'
import { Provider, ProviderContext, connectToContext, setProviderContext } from 'Provider'
import ugh from 'ugh'

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
      mapInitialized: false
    }

    // this is used to create a unique identifier for the map div
    this.target = `_ol_kit_map_${nanoid(6)}`

    // setup a boolean to tell this component to render a Provider wrapper if one is not mounted as a parent
    this.noProviderMounted = !ProviderContext

    // set the Provider context in the case that a <Provider> is not mounted
    if (this.noProviderMounted) setProviderContext(React.createContext())
  }

  componentDidMount () {
    const {
      map: passedMap,
      onMapInit,
      updateUrlDebounce,
      updateUrlFromView,
      updateViewFromUrl,
      urlViewParam
    } = this.props
    const onMapReady = map => {
      // pass map back via callback prop
      const initCallback = onMapInit(map)
      // if onMapInit prop returns a promise, render children after promise is resolved
      const isPromise = !!initCallback && typeof initCallback.then === 'function'

      // update AFTER onMapInit to get map into the state/context
      isPromise
        ? initCallback.then(() => this.setState({ mapInitialized: true }))
        : this.setState({ mapInitialized: true })
    }

    // if no map was passed, create the map
    this.map = !passedMap ? createMap({ target: this.target }) : passedMap

    // setup select interactions for the map
    this.initializeSelect(this.map)

    // callback for <Provider> if it's not mounted
    this.props.setContextProps(this.getContextProps())

    // optionally attach map listener
    if (updateUrlFromView) {
      const setUrl = () => updateUrlFromMap(this.map, urlViewParam)
      const mapMoveListener = debounce(setUrl, updateUrlDebounce)

      // update the url param after map movements
      this.map.on('moveend', mapMoveListener)
    }

    // optionally update map view from url param
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

  initializeSelect = map => {
    const { selectInteraction } = this.props

    if (selectInteraction) {
      // if select is passed as a prop always use that one first
      this.selectInteraction = selectInteraction
    } else {
      // otherwise create a new select interaction
      this.selectInteraction = createSelectInteraction()
    }

    // check the map to see if select interaction has been added
    const selectInteractionOnMap = map.getInteractions().getArray().find(interaction => {
      // this checks if the select interaction created or passed in is the same instance on the map and never double adds
      return interaction === this.selectInteraction
    })

    // do not double add the interaction to the map
    if (!selectInteractionOnMap) map.addInteraction(this.selectInteraction)
  }

  getContextProps = () => {
    const { translations } = this.props

    // do not pass unnecessary props to a Fragment
    return !this.noProviderMounted
      ? null
      : {
        map: this.map,
        selectInteraction: this.selectInteraction,
        translations
      }
  }

  render () {
    const { children, fullScreen, logoPosition, style } = this.props
    const { mapInitialized } = this.state
    // if a Provider is not mounted, wrap map with a Provider to allow context to exist either way
    const ContextWrapper = this.noProviderMounted ? Provider : React.Fragment

    return (
      <ContextWrapper {...this.getContextProps()}>
        <StyledMap
          id={this.target}
          fullScreen={fullScreen}
          style={style}>
          <MapLogo logoPosition={logoPosition} />
        </StyledMap>
        <>
          {mapInitialized // wait for map to initialize before rendering children
            ? children
            : null
          }
        </>
      </ContextWrapper>
    )
  }
}

Map.defaultProps = {
  fullScreen: false,
  logoPosition: 'left',
  map: null,
  onMapInit: () => {},
  updateUrlDebounce: 400,
  updateUrlFromView: true,
  updateViewFromUrl: true,
  urlViewParam: 'view',
  // setContextProps: () => {},
  style: {},
  translations: en
}

Map.propTypes = {
  /** any ol-kit children components will automatically be passed a reference to the map object via the `map` prop */
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  /** if this is set to false, the map will fill it's parent container */
  fullScreen: PropTypes.bool,
  /** place the ol-kit logo on the 'left', 'right', or set to 'none' to hide */
  logoPosition: PropTypes.string,
  /** optionally pass a custom map */
  map: PropTypes.object,
  /** callback called with initialized map object after optional animations complete
    note: if a Promise is returned from this function, Map will wait for onMapInit to resolve before rendering children
  */
  onMapInit: PropTypes.func,
  /** the length of debounce on map movements before the url gets updated */
  updateUrlDebounce: PropTypes.number,
  /** add map location coords + zoom level to url as query params */
  updateUrlFromView: PropTypes.bool,
  /** update map view based off the url param */
  updateViewFromUrl: PropTypes.bool,
  /** change the url param used to set the map location coords */
  urlViewParam: PropTypes.string,
  /** an openlayers select interaction passed down to connected components - created internally if not passed as prop */
  selectInteraction: PropTypes.object,
  /** callback passed by a <Provider> parent to attach props from this <Map> (map, selectInteraction, etc.) to context */
  setContextProps: PropTypes.func,
  /** apply inline styles to the map container */
  style: PropTypes.object,
  /** object of string key/values (see: locales) */
  translations: PropTypes.object
}

export default connectToContext(Map)
