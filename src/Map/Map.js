import React from 'react'
import PropTypes from 'prop-types'
import nanoid from 'nanoid'
import debounce from 'lodash.debounce'

import MapLogo from './MapLogo'
import {
  createMap,
  updateMapFromUrl,
  updateUrlFromMap,
  replaceZoomBoxCSS,
  addSelectInteraction
} from './utils'
import { StyledMap } from './styled'
import { connectToContext } from 'Provider'
import en from 'locales/en'
import ugh from 'ugh'
import olInteractionSelect from 'ol/interaction/Select'

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

    // map is passed as a prop- use this flag to determine whether a map/portal should be created
    this.passedMap = props.map

    // this is used to create a unique identifier for the map div
    this.target = props.id || `_ol_kit_map_${nanoid(6)}`
    if (this.passedMap) {
      // override target with openlayers map DOM target
      this.target = this.passedMap.getTarget()
    }
  }

  componentDidMount () {
    const {
      addMapToContext,
      contextProps,
      dragZoomboxStyle,
      map: passedMap,
      onMapInit,
      translations,
      updateUrlDebounce,
      updateUrlFromView,
      updateViewFromUrl,
      urlViewParam
    } = this.props

    // if no map was passed, create the map
    this.map = !this.passedMap ? createMap({ target: this.target }) : passedMap
    console.log('<Map> did mount', this.passedMap, !this.passedMap.getTargetElement())
    if (this.passedMap && !this.passedMap.getTargetElement()) {
      ugh.warn('A `map` prop has been passed to `<Map>` but the openlayers map has not been mounted to the DOM!')
    }

    // setup select interactions for the map
    this.initializeSelect(this.map)

    // optionally add zoombox styling
    replaceZoomBoxCSS(dragZoomboxStyle)

    // callback for <Provider> if it is mounted as hoc
    let mapConfig = {
      map: this.map,
      mapId: this.target,
      selectInteraction: this.selectInteraction,
      translations, // this can be hoisted to <Provider> only in the future
      ...contextProps
    }
    const onMapReady = map => {
      const allSystemsGo = () => {
        addMapToContext(mapConfig)
        this.setState({ mapInitialized: true })
      }
      // pass map back via callback prop
      const initCallback = onMapInit(map)
      // if onMapInit prop returns a promise, render children after promise is resolved
      const isPromise = !!initCallback && typeof initCallback.then === 'function'

      // update AFTER onMapInit to get map into the state/context
      isPromise
        ? initCallback
          .then((res = {}) => {
            const { contextProps = {} } = res

            // result of onMapInit may contain contextProps
            mapConfig = {
              ...mapConfig,
              ...contextProps
            }
          })
          .catch(e => ugh.error('Error caught in \'onMapInit\'', e))
          .finally(allSystemsGo) // always initialize app
        : allSystemsGo()
    }

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

    // check the map to see if select interaction has been added
    const selectInteractionOnMap = map.getInteractions().getArray()
      // Layer panel also adds a select interaction
      .filter(interaction => interaction._ol_kit_origin !== '_ol_kit_layer_panel_hover')
      // this checks if the select interaction created or passed in is the same instance on the map and never double adds
      .find(interaction => interaction instanceof olInteractionSelect)

    if (selectInteraction) {
      // if select is passed as a prop always use that one first
      this.selectInteraction = selectInteraction

      // do not double add the interaction to the map
      if (!selectInteractionOnMap) map.addInteraction(this.selectInteraction)
    } else {
      // otherwise create a new select interaction
      const { select } = addSelectInteraction(map)

      ugh.warn('<Map> has created a default select interaction (you can use getSelectInteraction(map) to access it). To have ol-kit use your custom select interaction, pass `selectInteraction` as a prop to <Map>.')

      this.selectInteraction = select
    }
  }

  render () {
    const { children, fullScreen, logoPosition, style, translations } = this.props
    const { mapInitialized } = this.state

    return (
      <>
        {!this.passedMap &&
          <StyledMap
            id={this.target}
            fullScreen={fullScreen}
            style={style}>
            <MapLogo logoPosition={logoPosition} translations={translations} />
          </StyledMap>
        }
        {mapInitialized // wait for map to initialize before rendering children
          ? children
          : null
        }
      </>
    )
  }
}

Map.defaultProps = {
  addMapToContext: () => {},
  contextProps: {},
  fullScreen: false,
  logoPosition: 'right',
  isMultiMap: false,
  map: null,
  onMapInit: () => {},
  updateUrlDebounce: 400,
  updateUrlFromView: true,
  updateViewFromUrl: true,
  urlViewParam: 'view',
  style: {},
  dragZoomboxStyle: { backgroundColor: 'rgb(0, 50, 50, 0.5)' },
  translations: en
}

Map.propTypes = {
  /** callback passed by a <Provider> parent to attach props from this <Map> (map, selectInteraction, etc.) to context */
  addMapToContext: PropTypes.func,
  /** any ol-kit children components will automatically be passed a reference to the map object via the `map` prop */
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  /** custom props that get added to Provider context and passed to connectToContext components */
  contextProps: PropTypes.object,
  /** if this is set to false, the map will fill it's parent container */
  fullScreen: PropTypes.bool,
  /** optional id to set on openlayers map and htmk id that map renders into (defaulted to unique id internally) */
  id: PropTypes.string,
  /** flag passed for <MultiMapManager> to recognize when <Map> is in multi-map mode */
  isMultiMap: PropTypes.bool,
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
  /** apply inline styles to the map container */
  style: PropTypes.object,
  /** apply styles to the OL shift-zoom box */
  dragZoomboxStyle: PropTypes.object,
  /** object of string key/values (see: locales) */
  translations: PropTypes.object
}

export default connectToContext(Map)
