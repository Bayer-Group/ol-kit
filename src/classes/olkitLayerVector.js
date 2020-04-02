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

class olkitLayerVector extends olLayerVector {
  constructor (opts) {
    super(opts)

    this.parser = new OpenLayersParser()
    this.userStyles = []
    this.defaultStyles = []
    this._defaultStylesCache = []
    this.isOlkitLayerVector = true
    this.setInitialStyle()
    this.setDefaultVectorStyles()

    return this
  }

  getAttributes () {
    return Object.keys(this.getSource().getFeatures()[0].getProperties())
  }

  fetchValuesForAttribute (attribute) {
    return this.getSource().getFeatures().map(feature => feature.getProperties()[`${attribute}`])
  }

  setUserVectorStyles (styles) {
    this.userStyles = styles

    this.applyVectorStyles()
  }

  getUserVectorStyles () {
    return this.userStyles
  }

  setDefaultVectorStyles () {
    this.parser.readStyle(this.getStyle()).then(style => {
      this._defaultStylesCache = style.rules
      this.defaultStyles = style.rules
    })
  }

  getDefaultVectorStyles () {
    return this.defaultStyles
  }

  updateDefaultVectorStyles (styles) {
    this.defaultStyles = styles

    this.applyVectorStyles()
  }

  resetDefaultVectorStyles () {
    this.defaultStyles = this._defaultStylesCache

    this.applyVectorStyles()
  }

  applyVectorStyles () {
    const filteredUserStyles = this.getUserVectorStyles().filter(style => {
      // do a safe check for the filter key
      if (!Array.isArray(style.filter)) return true
      const attributeValue = style.filter[1][2]

      return attributeValue !== ''
    })

    const style = {
      name: 'Custom Vector Style',
      rules: [
        ...this.getDefaultVectorStyles(),
        ...filteredUserStyles
      ]
    }

    this.parser
      .writeStyle(style)
      .then(olStyle => {
        // update the sld_body which is what geoserver uses to style the layer
        this.setStyle(olStyle)
      })
  }

  setInitialStyle () {
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

    this.setStyle(style)
  }
}

export default olkitLayerVector
