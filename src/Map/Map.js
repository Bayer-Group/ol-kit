import React from 'react'
import PropTypes from 'prop-types'
import nanoid from 'nanoid'
import { createMap } from './utils'

// context should only be created when <Map> is mounted (see constructor), otherwise it's null so child comps don't use context
export let MapContext = null

/**
 * A Reactified ol.Map wrapper component
 * @component
 * @category Map
 * @since 1.0.0
 */
class Map extends React.Component {
  constructor (props) {
    super(props)

    // this is used to create a unique identifier for the map div
    this.target = `_olKit_map_${nanoid(6)}`

    // create a map context
    MapContext = React.createContext()
  }

  componentDidMount () {
    const { map, onMapInit } = this.props

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
  }

  getContextValue = () => {
    return {
      map: this.map
    }
  }

  render () {
    return (
      <React.Fragment>
        <div id={this.target}></div>
        <MapContext.Provider value={this.getContextValue()}>
          {this.props.children}
        </MapContext.Provider>
      </React.Fragment>
    )
  }
}

Map.defaultProps = {
  map: null,
  onMapInit: () => {}
}

Map.propTypes = {
  /** all children components will automatically be passed a reference to the map object via the `map` prop */
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  /** optionally pass a custom map */
  map: PropTypes.object,
  /** returns an initialized map object if nothing was passed to the `map` prop */
  onMapInit: PropTypes.func.isRequired
}

export default Map
