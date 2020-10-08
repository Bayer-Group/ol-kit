import olMap from 'ol/Map'

/**
 * SyncableMap class extends olMap {@link https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html}
 * @function
 * @category Classes
 * @since 0.1.0
 * @param {Object} [opts] - Object of optional params for olMap
 */
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
