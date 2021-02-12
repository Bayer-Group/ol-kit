import Event from 'ol/events/Event'

/**
 * Sync multiple openlayers 
 * @function
 * @category MultiMap
 * @since 1.7.0
 * @param {Object} [views] - Array of openlayers views
 * @param {Object} [opts] - Object of optional params
 * @param {Object} [optSyncedViews] - Optional synced view override array
 */
export function syncViewEvents (views, eventType, optSyncedViews) {
  views.forEach((view, _, viewArray) => {
    const syncedViews = optSyncedViews || viewArray

    if (eventType) {
      view.on(eventType, e => mapChangeHandler(e, syncedViews))
    } else {
      // default to all map view movement events
      view.on('change:center', e => mapChangeHandler(e, syncedViews))
      view.on('change:resolution', e => mapChangeHandler(e, syncedViews))
      view.on('change:rotation', e => mapChangeHandler(e, syncedViews))
    }
  })
}

class ViewEvent extends Event {
  constructor (key, type, oldValue, target) {
    super(type)
    this.key = key
    this.type = type
    this.oldValue = oldValue
    this.target = target
  }
}

export function mapChangeHandler (event, syncedViews) {
    const eventView = event.target

    syncedViews.forEach(view => {
      // do not sync while view is animating
      if (view.ol_uid !== eventView.ol_uid && !view.getAnimating()) {
        switch (event.type) {
          case 'change:center':
            if (eventView.getInteracting()) {
              view.adjustCenter(eventView.getCenter().map((val, i) => val - event.oldValue[i]))
            } else if (event.key === 'resolution') {
              view.setCenter(eventView.getCenter())
            }
            break
          case 'change:resolution':
            eventView.dispatchEvent(new ViewEvent(event.key, 'change:center', 0, eventView))
            view.setResolution(eventView.getResolution())
            break
          case 'change:rotation':
            view.setRotation(eventView.getRotation())
            break
          default:
            return ''
        }
      }
    })
  }