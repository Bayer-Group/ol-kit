import olPointerInteraction from 'ol/interaction/Pointer'

export const ScaleFeatureType = {
  start: 'rotateStart',
  rotating: 'rotating',
  end: 'rotateEnd'
}

export class ScaleFeature {
  constructor (type, feature, angle, anchor) { // eslint-disable-line max-params
    this.propagationStopped = undefined
    this.type = type
    this.feature = feature
    this.angle = angle
  }

  preventDefault () {
    this.propagationStopped = true
  }

  stopPropagation () {
    this.propagationStopped = true
  }
}

export class ScaleInteraction extends olPointerInteraction {
  constructor (opts) {
    const options = opts || {}

    super(/** @type {import("./Pointer.js").Options} */ (options))

    /**
     * The last position we translated to.
     * @type {import("../coordinate.js").Coordinate}
     * @private
     */
    this.lastCoordinate_ = null

    /**
    * The start position before translation started.
    * @type {import("../coordinate.js").Coordinate}
    * @private
    */
    this.startCoordinate_ = null

    /**
     * @type {Collection<import("../Feature.js").default>}
     * @private
     */
    this.feature_ = options.feature !== undefined ? options.feature : null

    /**
     * @type {import("../Feature.js").default}
     * @private
     */
    this.lastFeature_ = null

    /**
     * @type {import("../Feature.js").default}
     * @private
     */
    this.filter_ = feature => true

    return this
  }

  // custom function to begin editing
  enable () {
    // set the interaction to active
    this.setActive(true)
  }

  /**
   * Handle pointer down events.
   * @param {import("../MapBrowserEvent.js").default} event Event.
   * @return {boolean} If the event was consumed.
   */
  handleDownEvent (event) {
    this.lastFeature_ = this.featuresAtPixel_(event.pixel, event.map)
    if (!this.lastCoordinate_ && this.lastFeature_) {
      this.startCoordinate_ = event.coordinate
      this.lastCoordinate_ = event.coordinate
      this.handleMoveEvent(event)

      const feature = this.feature_ || this.lastFeature_

      this.dispatchEvent(
        new ScaleFeature(
          'scalestart',
          feature,
          event.coordinate,
          this.startCoordinate_,
          event
        )
      )

      return true
    }

    return false
  }

  /**
   * Handle pointer up events.
   * @param {import("../MapBrowserEvent.js").default} event Event.
   * @return {boolean} If the event was consumed.
   */
  handleUpEvent (event) {
    if (this.lastCoordinate_) {
      this.lastCoordinate_ = null
      this.handleMoveEvent(event)

      const feature = this.lastFeature_

      this.dispatchEvent(
        new ScaleFeature(
          'translateend',
          feature,
          event.coordinate,
          this.startCoordinate_,
          event
        )
      )
      // cleanup
      this.startCoordinate_ = null

      return true
    }

    return false
  }

  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} event Event.
   */
  handleDragEvent (event) {
    if (this.lastCoordinate_) {
      const newCoordinate = event.coordinate
      const deltaX = this.lastCoordinate_[0] / newCoordinate[0]
      const deltaY = this.lastCoordinate_[0] / newCoordinate[0]

      const feature = this.features_ || this.lastFeature_

      // features.forEach(function (feature) {
      const geom = feature.getGeometry()

      geom.scale(deltaX, deltaY)
      feature.setGeometry(geom)
      // })

      this.lastCoordinate_ = newCoordinate

      this.dispatchEvent(
        new ScaleFeature(
          'translating',
          feature,
          newCoordinate,
          this.startCoordinate_,
          event
        )
      )
    }
  }

  /**
   * Handle pointer move events.
   * @param {import("../MapBrowserEvent.js").default} event Event.
   */
  handleMoveEvent (event) {
    const elem = event.map.getViewport()

    // Change the cursor to grab/grabbing if hovering any of the features managed
    // by the interaction
    if (this.featuresAtPixel_(event.pixel, event.map)) {
      elem.classList.remove(this.lastCoordinate_ ? 'ol-grab' : 'ol-grabbing')
      elem.classList.add(this.lastCoordinate_ ? 'ol-grabbing' : 'ol-grab')
    } else {
      elem.classList.remove('ol-grab', 'ol-grabbing')
    }
  }

  /**
   * Tests to see if the given coordinates intersects any of our selected
   * features.
   * @param {Pixel} pixel Pixel coordinate to test for intersection.
   * @param {PluggableMap} map Map to test the intersection on.
   * @return {Feature} Returns the feature found at the specified pixel
   * coordinates.
   * @private
   */
  featuresAtPixel_ (pixel, map) {
    return map.forEachFeatureAtPixel(
      pixel,
      function (feature, layer) {
        if (this.filter_(feature, layer)) {
          return feature
        }
      }.bind(this),
      {
        layerFilter: this.layerFilter_,
        hitTolerance: this.hitTolerance_
      }
    )
  }
}
