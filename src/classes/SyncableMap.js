import olMap from 'ol/Map'

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

  setSyncedState (state) {
    this.synced = state

    const eventType = state ? 'synced' : 'unsynced'

    this.dispatchEvent(eventType)
  }

  // methods handling visibility
  getVisibleState () {
    return this.visible
  }

  setVisibleState (state) {
    this.visible = state

    const eventType = state ? 'visible' : 'hidden'

    this.dispatchEvent(eventType)
  }
}
