import { coordDiff, targetDestination } from './coords'

/**
 * Sync multiple openlayers 
 * @function
 * @category MultiMap
 * @since 1.7.0
 * @param {Object} [maps] - Array of openlayers maps
 * @param {Object} [opts] - Object of optional params
 * @param {String} [opts.target] - html id tag that map will into which the map will render
 * @returns {ol.Map} A newly constructed [ol.Map]{@link https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html}
 */
export function syncMapEvents (maps, eventType, opts = {}) {
  maps.forEach(map => {
    const view = map.getView()

    console.log('syncMapEvents', view)

    if (eventType) {
      view.once(eventType, e => mapChangeHandler(e, maps))
    } else {
      console.log('ELSE')
      // default to all map view movement events
      map.on('moveend', e => mapChangeHandler(e, maps))
      view.on('change:resolution', e => mapChangeHandler(e, maps))
      view.on('change:rotation', e => mapChangeHandler(e, maps))
    }
  })
}

export function mapChangeHandler (event, syncedMaps) {
    const view = event.target

    console.log('mapCHangeHan', event.type)

    syncedMaps.map(map => {
      const thisView = map.getView()

      // do not sync while view is animating
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

      // syncMapEvents(thisView, event.type)
    })
  }