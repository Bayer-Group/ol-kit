import olLayerVector from 'ol/layer/vector'
import OpenLayersParser from 'geostyler-openlayers-parser'
import olStyleStyle from 'ol/style/style'
import olStyleFill from 'ol/style/fill'
import olStyleStroke from 'ol/style/stroke'
import olStyleCircle from 'ol/style/circle'
import olGeomPoint from 'ol/geom/point'
import olGeomLinestring from 'ol/geom/linestring'
import olGeomMultiPoint from 'ol/geom/multipoint'
import olGeomMultiLinestring from 'ol/geom/multilinestring'

/**
 * VectorLayer class extends olLayerVector {@link https://openlayers.org/en/v4.6.5/apidoc/ol.layer.Vector.html}
 * @function
 * @category Classes
 * @since NEXT
 * @param {Object} [opts] - Object of optional params for olLayerVector
 */
class VectorLayer extends olLayerVector {
  constructor (opts) {
    super(opts)

    this.parser = new OpenLayersParser()
    this.userStyles = []
    this.defaultStyles = []
    this._defaultStylesCache = []
    this.isVectorLayer = true
    if (!opts.style) this._setInitialStyle()
    this.setDefaultVectorStyles()

    return this
  }

  /**
   * A function that returns the VectorLayers attributes
   * @function
   * @since NEXT
   * @returns {Array} VectorLayer attributes
   */
  getAttributes () {
    return Object.keys(this.getSource().getFeatures()[0].getProperties())
  }

  /**
   * A function that returns the VectorLayers values of a specific attribute
   * @function
   * @since NEXT
   * @param {String} - olFeature property
   * @returns {Array} VectorLayer values of a specific attribute
   */
  fetchValuesForAttribute (attribute) {
    const dupes = this.getSource().getFeatures().map(feature => feature.getProperties()[`${attribute}`])

    return [...new Set(dupes)]
  }

  /**
   * A function that sets custom styles from ManageLayer
   * @function
   * @since NEXT
   * @param {Object} - Geostyler OpenLayers Parser rules object {@link https://github.com/geostyler/geostyler-openlayers-parser}
   */
  setUserVectorStyles (styles) {
    this.userStyles = styles

    this._applyVectorStyles()
  }

  /**
   * A function that returns the VectorLayers custom user styles
   * @function
   * @since NEXT
   * @returns {Object} Geostyler rules object
   */
  getUserVectorStyles () {
    return this.userStyles
  }

  /**
   * A function that sets default styles of a VectorLayer
   * @function
   * @since NEXT
   */
  setDefaultVectorStyles () {
    this.parser.readStyle(this.getStyle()()).then(style => {
      this._defaultStylesCache = style.rules
      this.defaultStyles = style.rules
    })
  }

  /**
   * A function that returns the VectorLayers default VectorLayer styles
   * @function
   * @since NEXT
   * @returns {Object} Geostyler rules object
   */
  getDefaultVectorStyles () {
    return this.defaultStyles
  }

  /**
   * A function that updates default styles of a VectorLayer
   * @function
   * @since NEXT
   * @param {Object} - Geostyler OpenLayers Parser rules object {@link https://github.com/geostyler/geostyler-openlayers-parser}
   */
  updateDefaultVectorStyles (styles) {
    this.defaultStyles = styles

    this._applyVectorStyles()
  }

  /**
   * A function that resets default styles of a VectorLayer back to its original default
   * @function
   * @since NEXT
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
    const geomType = this.getSource().getFeatures()[0].getGeometry()

    if (geomType instanceof olGeomPoint || geomType instanceof olGeomMultiPoint) {
      style = [new olStyleStyle({
        image: new olStyleCircle({
          fill: new olStyleFill({ color: 'rgba(255,255,255,1)' }),
          stroke: new olStyleStroke({ color: '#3399CC', width: 2 }),
          radius: 5,
          snapToPixel: true
        })
      })]
    } else if (geomType instanceof olGeomLinestring || geomType instanceof olGeomMultiLinestring) {
      style = [new olStyleStyle({
        stroke: new olStyleStroke({ color: '#3399CC', width: 2 })
      })]
    } else {
      style = [new olStyleStyle({
        fill: new olStyleFill({ color: 'rgba(255,255,255,1)' }),
        stroke: new olStyleStroke({ color: '#3399CC', width: 2 })
      })]
    }

    this.setStyle(() => style)
  }
}

export default VectorLayer
