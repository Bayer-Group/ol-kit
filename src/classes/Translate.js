import ugh from 'ugh'
import olInteractionTranslate from 'ol/interaction/Translate'
import * as olArray from 'ol/array'

export default class Translate extends olInteractionTranslate {
  constructor (props) {
    super(props)

    return this
  }

  featuresAtPixel_ = (pixel, map) => {
    const mapFeature = map.forEachFeatureAtPixel(pixel,
      function (feature) {
        if (!this.features_ ||
            olArray.includes(this.features_.getArray(), feature)) {
          return feature
        }
      }.bind(this), {
        layerFilter: this.layerFilter_,
        hitTolerance: this.hitTolerance_
      })

    try {
      const coordinate = map.getCoordinateFromPixel(pixel)
      const intersectFeatures = this.features_.getArray().filter(f => f.getGeometry().intersectsCoordinate(coordinate))

      return mapFeature || intersectFeatures[intersectFeatures.length - 1]
    } catch (e) {
      ugh.warn(`Custom functionality failed: ${e.message}`, e)

      return super.featuresAtPixel_(pixel, map)
    }
  }
}
