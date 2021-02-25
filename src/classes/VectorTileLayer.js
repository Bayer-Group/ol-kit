import nanoid from 'nanoid'
import olVectorTile from 'ol/layer/VectorTile'
import OpenLayersParser from 'geostyler-openlayers-parser'
import olStyleStyle from 'ol/style/Style'
import olStyleFill from 'ol/style/Fill'
import olStyleStroke from 'ol/style/Stroke'
import olStyleCircle from 'ol/style/Circle'
import olGeomPoint from 'ol/geom/Point'
import olGeomLinestring from 'ol/geom/LineString'
import olGeomMultiPoint from 'ol/geom/MultiPoint'
import olGeomMultiLinestring from 'ol/geom/MultiLineString'

/**
 * VectorTileLayer class extends olLayerVector {@link https://openlayers.org/en/latest/apidoc/module-ol_layer_Vector-VectorTileLayer.html}
 * @function
 * @category Classes
 * @since 1.4.0
 * @param {Object} [opts] - Object of optional params for olLayerVector
 */
class VectorTileLayer extends olVectorTile {
  constructor (opts) {
    if (!opts?.className) opts.className = `_ol_kit_vector_layer_${nanoid()}`
    super(opts)

    this.parser = new OpenLayersParser()
    this.userStyles = []
    this.defaultStyles = []
    this._defaultStylesCache = []
    this.isVectorTileLayer = true
    if (!opts?.style) this._setInitialStyle()
    this.setDefaultVectorStyles()

    return this
  }

  /**
   * A function that returns the VectorTileLayers attributes
   * @function
   * @since 1.4.0
   * @returns {Array} VectorTileLayer attributes
   */
  getAttributes () {
    // Vector tile layers don't have the convention that all features have to share the same attributes so we have to get all of the features and summarize their attributes.
    return this.getSource()
      .getFeaturesInExtent([-Infinity, -Infinity, Infinity, Infinity]) // get all available features
      .reduce((attributes, feature) => {
        return [...new Set([...attributes, ...Object.keys(feature.getProperties())]).values()]
      }, [])
  }

  /**
   * A function that returns the VectorTileLayers values of a specific attribute
   * @function
   * @since 1.4.0
   * @param {String} - olFeature property
   * @returns {Array} VectorTileLayer values of a specific attribute
   */
  fetchValuesForAttribute (attribute) {
    const dupes = this.getSource().getFeaturesInExtent([-Infinity, -Infinity, Infinity, Infinity]).map(feature => feature.getProperties()[`${attribute}`])

    return [...new Set(dupes)]
  }

  /**
   * A function that sets custom styles from ManageLayer
   * @function
   * @since 1.4.0
   * @param {Object} - Geostyler OpenLayers Parser rules object {@link https://github.com/geostyler/geostyler-openlayers-parser}
   */
  setUserVectorStyles (styles) {
    this.userStyles = styles

    this._applyVectorStyles()
  }

  /**
   * A function that returns the VectorTileLayers custom user styles
   * @function
   * @since 1.4.0
   * @returns {Object} Geostyler rules object
   */
  getUserVectorStyles () {
    return this.userStyles
  }

  /**
   * A function that sets default styles of a VectorTileLayer
   * @function
   * @since 1.4.0
   */
  setDefaultVectorStyles () {
    return this.parser.readStyle(this.getStyle()()).then(style => {
      this._defaultStylesCache = style.rules
      this.defaultStyles = style.rules
    })
  }

  /**
   * A function that returns the VectorTileLayers default VectorTileLayer styles
   * @function
   * @since 1.4.0
   * @returns {Object} Geostyler rules object
   */
  getDefaultVectorStyles () {
    return this.defaultStyles
  }

  /**
   * A function that updates default styles of a VectorTileLayer
   * @function
   * @since 1.4.0
   * @param {Object} - Geostyler OpenLayers Parser rules object {@link https://github.com/geostyler/geostyler-openlayers-parser}
   */
  updateDefaultVectorStyles (styles) {
    this.defaultStyles = styles

    this._applyVectorStyles()
  }

  /**
   * A function that resets default styles of a VectorTileLayer back to its original default
   * @function
   * @since 1.4.0
   */
  resetDefaultVectorStyles () {
    this.defaultStyles = this._defaultStylesCache

    this._applyVectorStyles()
  }

  _applyVectorStyles () {
    const filteredUserStyles = this.getUserVectorStyles().filter(style => {
      // do a safe check for the filter key
      if (!Array.isArray(style.filter)) return true
      const attributeValue = style.filter[1][2]

      return attributeValue !== ''
    })

    const style = {
      name: this.get('title') || 'Custom Vector Style',
      rules: [
        ...this.getDefaultVectorStyles(),
        ...filteredUserStyles
      ]
    }

    return this.parser
      .writeStyle(style)
      .then(olStyle => {
        // update the sld_body which is what geoserver uses to style the layer
        this.setStyle(olStyle)
      })
  }

  _setInitialStyle () {
    let style = {}
    const hasFeatures = this.getSource().getFeaturesInExtent([0, 0, Infinity, Infinity]).length
    const geomType = hasFeatures ? this.getSource()
      .getFeaturesInExtent([0, 0, Infinity, Infinity])[0].getGeometry() : null

    if (geomType instanceof olGeomPoint || geomType instanceof olGeomMultiPoint) {
      style = [new olStyleStyle({
        image: new olStyleCircle({
          fill: new olStyleFill({ color: 'rgba(255,255,255,0.5)' }),
          stroke: new olStyleStroke({ color: '#3399CC', width: 2 }),
          radius: 5
        })
      })]
    } else if (geomType instanceof olGeomLinestring || geomType instanceof olGeomMultiLinestring) {
      style = [new olStyleStyle({
        stroke: new olStyleStroke({ color: '#3399CC', width: 2 })
      })]
    } else {
      style = [new olStyleStyle({
        fill: new olStyleFill({ color: 'rgba(255,255,255,0.5)' }),
        stroke: new olStyleStroke({ color: '#3399CC', width: 2 })
      })]
    }

    this.setStyle(() => style)
  }
}

export default VectorTileLayer
