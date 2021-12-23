import olMap from 'ol/Map'
import Event from 'ol/events/Event'

class SyncEvent extends Event {
  constructor (type, synced, mapBrowserEvent) {
    super(type)
    this.synced = synced
    this.mapBrowserEvent = mapBrowserEvent
  }
}

class VisibleEvent extends Event {
  constructor (type, visible, mapBrowserEvent) {
    super(type)
    this.visible = visible
    this.mapBrowserEvent = mapBrowserEvent
  }
}

export default class SyncableMap extends olMap {
  constructor (opts = {}) {
    super(opts)

    this.synced = opts.synced || false
    this.visible = opts.visible || false
  }

  // methods handling map syncing
  getSyncedState () {
    return this.synced
  }

  setSyncedState (isSynced) {
    this.synced = isSynced
    const event = new SyncEvent('synced', isSynced)

    this.dispatchEvent(event)
  }

  // methods handling visibility
  getVisibleState () {
    return this.visible
  }

  setVisibleState (isVisible) {
    this.visible = isVisible
    const event = new VisibleEvent('visible', isVisible)

    this.dispatchEvent(event)
  }
}
