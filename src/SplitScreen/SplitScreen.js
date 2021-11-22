import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Tooltip } from '@material-ui/core'
import olLayerGroup from 'ol/layer/Group'

import { connectToContext } from 'Provider'
import MapDisplayElement from './MapDisplayElement'
import Slider from './Slider'
import { coordDiff, refreshMapSizeCSS, targetDestination } from './utils'
import { Container, MapDisplayContainer, ControlStylesContainer, MapControlButton } from './styled'

class SplitScreen extends Component {
  constructor (props) {
    super(props)

    this.state = {}

    this.changeHandler = this.changeHandler.bind(this)
    this.sliderNode = undefined
  }

  updateMapSize = async maps => {
    return maps.forEach(map => map.updateSize())
  }

  handleMapChange = (mapCount, force = true) => {
    const { maps, forceUpdate } = this.props

    // refreshMapSizeCSS(mapCount, this.sliderNode?.getBoundingClientRect?.())
    this.updateMapSize(maps)

    // if (force) forceUpdate()
  }

  handleResize = () => {
    const { visibleMapCount } = this.props

    this.handleMapChange(visibleMapCount) // update the map css, openlayers map size, and force the component to update
  }

  handleUnmountedResize = () => {
    const { visibleMapCount } = this.props

    this.handleMapChange(visibleMapCount, false) // update the map css and openlayers map size without forcing the component to update as well
  }

  componentDidMount () {
    const { startPosition } = this.state
    const { maps, forceUpdate } = this.props

    // remove the unmounted window resize handler (see comonentWillUnmount)
    window.removeEventListener('resize', this.handleUnmountedResize)
    // when the window is resized, update the maps
    window.addEventListener('resize', this.handleResize)

    // const { right } = maps[0]?.getTargetElement()?.getBoundingClientRect()

    // if (right === window.innerWidth && !startPosition) {
    //   this.setState({ startPosition: window.innerWidth / 2 })
    //   forceUpdate()
    // } else {
    //   this.setState({ startPosition: right })
    // }
  }

  componentWillUnmount () {
    // remove the mounted resize listener and add the unmounted resize listener so we can refresh the map css without forcing the component to update
    window.removeEventListener('resize', this.handleResize)
    window.addEventListener('resize', this.handleUnmountedResize)
  }

  syncMapEvents (view, type) {
    if (type) {
      view.once(type, this.changeHandler)
    } else {
      view.once('change:center', this.changeHandler)
      view.once('change:resolution', this.changeHandler)
      view.once('change:rotation', this.changeHandler)
    }
  }

  desyncMapEvents (view) {
    view.un('change:center', this.changeHandler)
    view.un('change:resolution', this.changeHandler)
    view.un('change:rotation', this.changeHandler)
  }

  changeHandler (event) {
    const view = event.target
    const { maps } = this.props
    const syncedMaps = maps.filter(m => m.getSyncedState())

    syncedMaps.map(map => {
      const thisView = map.getView()

      if (thisView !== view && !thisView.getAnimating()) {
        switch (event.type) {
          case 'change:center':
            if (view.getInteracting()) {
              const { distance, bearing } = coordDiff(event.oldValue, view.getCenter(), map.getView())
              const destination = targetDestination(thisView.getCenter(), distance, bearing, map.getView())

              return thisView.setCenter(destination)
            }
            break
          case 'change:resolution':
            return thisView.setResolution(view.getResolution())
          case 'change:rotation':
            return thisView.setRotation(view.getRotation())
          default:
            return ''
        }
      }

      this.syncMapEvents(thisView, event.type)
    })
  }

  removeMap = () => {
    const { maps, onMapRemoved, visibleMapCount } = this.props
    const mapIndex = visibleMapCount - 1
    const mapToRemove = maps[mapIndex]

    mapToRemove.setVisibleState(false)
    mapToRemove.setSyncedState(false)
    mapToRemove.setLayerGroup(new olLayerGroup())

    // update UI & alert component parent of change
    this.handleMapChange(visibleMapCount - 1)

    if (visibleMapCount - 1 === 2) this.setState({ startPosition: window.innerWidth / 2 })
    onMapRemoved(mapIndex)
  }

  addMap = () => {
    const { onMapAdded, maps, visibleMapCount } = this.props
    const nextMapIdx = visibleMapCount
    const prevMap = maps[nextMapIdx - 1]
    const mapToAdd = maps[nextMapIdx]
    const prevMapLayer = prevMap.getLayerGroup().getLayers().item(0)

    mapToAdd.setVisibleState(true)
    mapToAdd.setSyncedState(true)

    mapToAdd.getLayers().setAt(0, prevMapLayer)

    mapToAdd.getView().setCenter(prevMap.getView().getCenter())
    mapToAdd.getView().setZoom(prevMap.getView().getZoom())

    // first de-sync everything (this prevents double binding sync events)
    maps.map(m => this.desyncMapEvents(m.getView()))

    // now get the syncable maps and then sync them
    maps.filter(m => m.getSyncedState()).map(m => this.syncMapEvents(m.getView()))

    // update UI & alert component parent of change
    this.handleMapChange(visibleMapCount + 1)

    if (visibleMapCount + 1 === 2) this.setState({ startPosition: window.innerWidth / 2 })
    onMapAdded(nextMapIdx)
  }

  toggleSyncMap = (i) => {
    const { maps, toggleSyncMap } = this.props
    const currentSyncState = maps[i].getSyncedState()

    // set the map sync state to the inverse
    maps[i].setSyncedState(!currentSyncState)

    // first de-sync everything (this prevents double binding sync events)
    maps.map(m => this.desyncMapEvents(m.getView()))

    // now get the syncable maps and then sync them
    maps.filter(m => m.getSyncedState()).map(m => this.syncMapEvents(m.getView()))

    // update UI & alert component parent of change
    this.props.forceUpdate()
    toggleSyncMap()
  }

  render () {
    const { startPosition } = this.state
    const { translations, maps, syncedState, visibleState, visibleMapCount } = this.props
    const disabled = false

    this.handleMapChange(visibleMapCount, false)

    return (
      <Container>
        {disabled
          ? <div className='alert alert-warning' role='alert'>{translations['geokit.SplitScreen.disabled']}</div>
          : null
        }
        <MapDisplayContainer disabled={disabled}>
          {visibleState.map((visible, i) => {
            const grow = i === 0 && visibleMapCount === 3

            if (visible) {
              return <MapDisplayElement
                key={i}
                index={i}
                map={maps[i]}
                grow={grow}
                mapNumber={i + 1}
                synced={syncedState[i]}
                toggleSyncMap={this.toggleSyncMap}
                disabled={disabled}
                translations={translations} />
            }
          })}
        </MapDisplayContainer>
        {startPosition && visibleMapCount === 2 &&
          <Slider
            initialPosition={startPosition}
            onDrag={() => this.props.forceUpdate()}
            ref={node => (this.sliderNode = node)}
          />}
        <ControlStylesContainer>
          <Tooltip title={translations['geokit.SplitScreen.addMap']} placement='right' disabled={false}>
            <div>
              <MapControlButton
                onClick={this.addMap}
                disabled={disabled || (visibleMapCount === maps.length)}>
                <i className='zmdi zmdi-plus' />
              </MapControlButton>
            </div>
          </Tooltip>
          <Tooltip title={translations['geokit.SplitScreen.removeMap']} placement='right' disabled={!disabled}>
            <div>
              <MapControlButton
                onClick={this.removeMap}
                disabled={disabled || visibleMapCount === 1}>
                <i className='zmdi zmdi-minus' />
              </MapControlButton>
            </div>
          </Tooltip>
        </ControlStylesContainer>
      </Container>
    )
  }
}

SplitScreen.defaultProps = {
  forceUpdate: () => {},
  onMapAdded: () => {},
  onMapRemoved: () => {},
  toggleSyncMap: () => {},
  translations: {
    'geokit.SplitScreen.disabled': 'Disabled',
    'geokit.SplitScreen.addMap': 'Add Map',
    'geokit.SplitScreen.removeMap': 'Remove Map'
  }
}

SplitScreen.propTypes = {
  translations: PropTypes.object,
  visibleMapCount: PropTypes.number,
  maps: PropTypes.array,
  onMapRemoved: PropTypes.func,
  onMapAdded: PropTypes.func,
  forceUpdate: PropTypes.func,
  toggleSyncMap: PropTypes.func,
  syncedState: PropTypes.array,
  visibleState: PropTypes.array
}

export default connectToContext(SplitScreen)
