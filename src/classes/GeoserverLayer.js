import allSettled from 'promise.allsettled'
import olLayerImage from 'ol/layer/image'
import olLayerTile from 'ol/layer/tile'
import olLayerVector from 'ol/layer/vector'
import olSourceImageWMS from 'ol/source/imagewms'
import olSourceTileWMS from 'ol/source/tilewms'
import olSourceVector from 'ol/source/vector'
import customOlFormatWFS from 'classes/CustomOlFormatWFS'
import olLayerGroup from 'ol/layer/group'
import olGeomPolygon from 'ol/geom/polygon'
import olGeomCircle from 'ol/geom/circle'

import ugh from 'ugh'
import escapeRegExp from 'lodash.escaperegexp'
import SLDParser from '@bayer/geostyler-geoserver-sld-parser'

import WFSClient from './WFSClient'
import WFSClientParser from './WFSClientParser'
import WMSClient from './WMSClient'
import WMSClientParser from './WMSClientParser'
import RasterSourceFactory from './RasterSourceFactory'
import olFormatFilterBbox from 'ol/format/filter/bbox'
import olFormatFilterAnd from 'ol/format/filter/and'
import olFormatFilterEqualTo from 'ol/format/filter/equalto'
import olFormatFilterIntersects from 'ol/format/filter/intersects'

// backwards compatibility for chrome <= 75
allSettled.shim() // will be a no-op if not needed

const wmsLayerTypes = [olLayerImage, olLayerTile]

/**
 * A class to manage layers from geoserver with both a WMS and WFS component
 * @class
 * @since 3.12.0
 * @param {Object} olOpts - Options passed down to ol/layer/Group
 * @param {Object} classOpts - Options for the GeoserverLayer class to set things up
 * @returns {GeoserverLayer} An instance of GeoserverLayer
 */
export default class GeoserverLayer extends olLayerGroup {
  constructor (olOpts, classOpts = {}) {
    if (!olOpts.layers || olOpts.layers.length > 2) throw new Error('You must pass an image and a vector layer (2 total) to create a GeoserverLayer')

    super(olOpts)

    // apply styles and filters in the constructor (same as if calling the methods directly)
    this._defaultStylesCache = classOpts.defaultStyles || []
    this.defaultStyles = classOpts.defaultStyles || []
    this.userStyles = classOpts.userStyles || []

    if (classOpts.uri) this.uri = /https?:\/\/.*ows/.exec(classOpts.uri)
    this.typeName = classOpts.typeName
    this.attributes = classOpts.attributes || []
    this.geometryName = classOpts.geometryName
    this.getHeaders = classOpts.getHeaders
    this.attrValuesMap = new Map()
    this.isGeoserverLayer = true
    this.initialFilterMap = classOpts.initialFilterMap || new Map()

    this._applyWMSStyles()
    this.setWMSFilters(classOpts.filters)

    return this
  }

  setLayers (layers) {
    // add ref to parent layer to each layer in this group
    layers.forEach(layer => layer.set('_ol_kit_parent', this))
    // reference to setLayers method from olLayerGroup
    super.setLayers(layers)
  }

  /**
   * Returns the URI of the layer (on which WMS & WFS requests are built)
   * @method
   * @since 3.12.0
   * @returns {String}
   */
  getUri () {
    return this.uri
  }

  /**
   * Returns the typeName of the layer (passed in when the layer is created)
   * @method
   * @since 3.12.0
   * @returns {String}
   */
  getTypeName () {
    return this.typeName
  }

  /**
   * Returns the attributes of the layer (passed in when the layer is created)
   * @method
   * @since 3.12.0
   * @returns {String[]} An array of attribute names
   */
  getAttributes () {
    return this.attributes
  }

  /**
   * Returns an array of strings representing the values for the passed attribute
   * @method
   * @since 3.12.0
   * @returns {String[]} An array of value names
   */
  fetchValuesForAttribute (map, attribute, opts) {
    const MAX_FEATURES = 10000
    const extent = map.getView().calculateExtent()
    const body = {
      // We only want the features for the current map extent
      filter: olFormatFilterBbox(this.geometryName, extent, 'EPSG:3857'),
      // If issues arise with performance over loading this many features set this to some other value or possibly make a saga.
      maxFeatures: MAX_FEATURES,
      // The default output is XML so set it to JSON to make it easier to parse
      outputFormat: 'application/json',
      // attempt to solve 'featureTypes must be array' assertion error
      featureTypes: [this.typeName],
      // hardcoded srsName which isn't provided by GeoserverLayer
      srsName: 'urn:ogc:def:crs:EPSG:4326',
      // parse prefix from typeName
      featurePrefix: this.typeName.split(':')[0],
      propertyNames: [opts.attribute]
    }

    return this.fetchFeatures(body)
      .then(features => {
        console.log('fetched features', features.length)

        return features.map(f => f[attribute])
      })
  }

  /**
   * Returns the name of the geometry attribute of the layer (passed in when the layer is created)
   * @method
   * @since 3.12.0
   * @returns {String}
   */
  getGeometryName () {
    return this.geometryName
  }

  /**
   * Returns all the features contained within the vector layer
   * @method
   * @since 3.12.0
   * @returns {olCollection} An Openlayers collection of features
   */
  getFeatures () {
    return this.getWFSLayer().getSource().getFeatures()
  }

  /**
   * Returns the zindex of the underlying WMS/WFS layers
   * @method
   * @since 3.12.0
   * @returns {Number} An integer representing the zindex of the layer
   */
  getZIndex () {
    return this.getWMSLayer().getZIndex()
  }

  /**
   * Clears all the features contained within the vector layer
   * @method
   * @since 3.12.0
   */
  clearFeatures () {
    return this.getWFSLayer().getSource().clear()
  }

  /**
   * Returns the vector layer of the GeoserverLayer
   * NOTE: if you are working with a raster layer the vector layer
   * will never have any features...check the layer mode to see if
   * it's operating in raster layer mode
   * @method
   * @since 3.12.0
   * @returns {olLayerVector} A Openlayers vector layer
   */
  getWFSLayer () {
    return this.getLayers().getArray().find(l => l instanceof olLayerVector)
  }

  /**
   * Returns the image layer of the GeoserverLayer
   * @method
   * @since 3.12.0
   * @returns {olLayerImage|olLayerTile} One of two Openlayers image types
   */
  getWMSLayer () {
    return this.getLayers().getArray().find(l => wmsLayerTypes.find(t => l instanceof t))
  }

  /**
   * Gets the default geostyler rules being used on the WMS layer
   * More info on geostyler: https://github.com/terrestris/geostyler-sld-parser
   * @method
   * @since 3.12.0
   */
  getDefaultWMSStyles () {
    return this.defaultStyles
  }

  /**
   * Resets the layer's styling back to its default styles (passed in the constructor)
   * @method
   * @since 3.12.0
   */
  resetDefaultWMSStyles () {
    this.defaultStyles = this._defaultStylesCache

    this._applyWMSStyles()
  }

  /**
   * Gets user provided geostyler rules being used on the WMS layer
   * More info on geostyler: https://github.com/terrestris/geostyler-sld-parser
   * @method
   * @since 3.12.0
   */
  getUserWMSStyles () {
    return this.userStyles
  }

  /**
   * Sets the default WMS SLD from an array of geostyler rules
   * More info on geostyler: https://github.com/terrestris/geostyler-sld-parser
   * @method
   * @since 3.12.0
   */
  setDefaultWMSStyles (styles) {
    this.defaultStyles = styles

    this._applyWMSStyles()
  }

  /**
   * Sets the default WMS SLD from a geostyler style object
   * More info on geostyler: https://github.com/terrestris/geostyler-sld-parser
   * @method
   * @since 3.12.0
   */
  setUserWMSStyles (styles) {
    this.userStyles = styles

    this._applyWMSStyles()
  }

  /**
   * Set the zindex of the underlying WMS/WFS layers
   * @method
   * @since 3.12.0
   */
  setZIndex (idx) {
    // we want both the parent and its children to have the same z-index set
    super.setZIndex(idx)
    this.getWMSLayer().setZIndex(idx)
    this.getWFSLayer().setZIndex(idx)
  }

  /**
   * Applies the user and default styles to the child layer sources
   * This method will cause the layers to re-render themselves with the new styling
   * @method
   * @since 3.12.0
   */
  _applyWMSStyles () {
    const parser = new SLDParser()
    const filteredUserStyles = this.getUserWMSStyles().filter(style => {
      // do a safe check for the filter key
      if (!Array.isArray(style.filter)) return true
      const attributeValue = style.filter[1][1] instanceof Array
        ? style.filter[1][1][1][2]
        : style.filter[1][2]

      return attributeValue !== ''
    })

    if (this.getAttributes().includes('deleted')) {
      filteredUserStyles.map(style => {
        if (!Array.isArray(style.filter)) {
          // if deleted attribute exists & a filter is missing, set it to deleted filter
          style.filter = ['==', 'deleted', 'false']
        }
        // the second item in the filter array should always be the deleted tag false so if it doesn't have that then
        // add it by pushing to the array
        if (!style.filter[2]) {
          style.filter.push(['==', 'deleted', 'false'])
        }
      })
    }

    const style = {
      name: this.getTypeName(),
      rules: [
        ...this.getDefaultWMSStyles(),
        ...filteredUserStyles
      ]
    }

    return parser
      .writeStyle(style)
      .then(sldString => {
        // update the sld_body which is what geoserver uses to style the layer
        this.getWMSLayer().getSource().setStyle(sldString)
      })
  }

  /**
   * Gets the layer's WMS filter (using an internal JS map format)
   * @method
   * @since 3.12.0
   */
  getWMSFilters (filter) {
    return this.wmsfilters
  }

  /**
   * Sets the layer's WMS filter (using an internal JS map format)
   * @method
   * @since 3.12.0
   */
  setWMSFilters (filters = [], opts = {}) {
    this.wmsfilters = filters
    const wmsSource = this.getWMSLayer().getSource()

    const filtersToStrings = filters => {
      const filterStrings = filters.map(({ attribute, value: val }) => {
        return opts.commaDelimitedAttributes && opts.commaDelimitedAttributes.includes(attribute)
                ? `strMatches(${attribute}, '^${escapeRegExp(val)}( )??,.*') = TRUE OR strMatches(${attribute}, '.*,( )??${escapeRegExp(val)}( )??,.*') = TRUE OR strMatches(${attribute}, '.*,( )??${escapeRegExp(val)}( )??$') = TRUE OR ${attribute} = '${escapeRegExp(val)}'` // eslint-disable-line
          : `${attribute} = '${val}'`
      })

      // if there's only one filter we simply return it, otherwise we use the logical operator of the first filter
      return filterStrings.length === 1 ? filterStrings[0] : filterStrings.join(` ${filters[0].logical} `)
    }

    // update the cql_param which is what geoserver uses to filter the WMS layer
    if (filters.length) {
      wmsSource.setFilter(filtersToStrings(filters))

    // if we don't remove the filter geoserver will filter out the entire layer (nothing will show)
    } else {
      wmsSource.removeFilter()
    }

    // ensures the view is updated with new tiles from the server (based on the cql_filter)
    wmsSource.refresh()
  }

  setOlFilters (olFilters) {
    this.olFilters = olFilters

    this.dispatchEvent('filter:change')
  }

  /**
   * Provides a means of querying the underlying layer's WFS service to fetch
   * features given a set of options passed to ol/format/WFS
   * @method
   * @since 3.12.0
   * @returns {Promise} A promise which resolves to an array of ol/Feature objects
   */
  fetchFeatures (getFeatureOpts) {
    const defaultHeaders = {
      'Content-Type': 'text/xml'
    }
    const formatWFS = new customOlFormatWFS({
      featureNS: 'http://www.opengis.net/wfs'
    })
    const body = formatWFS.writeGetFeature(getFeatureOpts)

    // make a POST request with a WFS GetFeature XML payload
    //     return axios.post(this.uri, body.outerHTML, { headers: this.getHeaders(defaultHeaders) })
    return fetch(this.uri, {
      method: 'POST',
      body: body.outerHTML,
      headers: this.getHeaders(defaultHeaders)
    })
      .then(res => res.json())
      .then(({ status, statusText, data }) => {
        if (status !== 200) throw new Error(statusText)

        const opts = { dataProjection: formatWFS.readProjection(data), featureProjection: 'EPSG:3857' } // do we know the map projection?
        const features = formatWFS.readFeatures(data, opts)

        // set reference to parent layer on features
        features.forEach(feature => feature.set('_ol_kit_parent', this))

        return features
      })
  }

  /**
   * Provides a means of querying the underlying layer's WFS service to fetch
   * features intersecting a given geometry
   * @method
   * @since 3.12.0
   * @returns {Promise} A promise which resolves to an array of ol/Feature objects
   */
  fetchFeaturesIntersectingGeom (geom, opts = { maxFeatures: 50, featureTypes: [] }) {
    let filter = {}
    const olIntersectsFilter = new olFormatFilterIntersects(this.geometryName, geom)
    const existingFilters = ['AND', new Map(this.initialFilterMap)]
    const intersectParams = new Set([[this.geometryName, geom, 'EPSG:3857']])

    existingFilters[1].set('INTERSECTS', intersectParams)

    // if the layer has a deleted attribute, add this to the filter
    if (this.getAttributes().includes('deleted')) {
      filter = new olFormatFilterAnd(this.olFilters, olIntersectsFilter, new olFormatFilterEqualTo('deleted', false))
      existingFilters[1].set('EQUALS', new Map([['deleted', false]]))
    } else {
      filter = new olFormatFilterAnd(this.olFilters, olIntersectsFilter)
    }

    const filterOpts = {
      srsName: 'EPSG:3857',
      filter: filter,
      featureTypes: [...opts.featureTypes, this.typeName],
      maxFeatures: opts.maxFeatures,
      outputFormat: opts.outputFormat
    }

    return this.fetchFeatures(filterOpts)
  }

  /**
   * Provides a means of querying the underlying layer's WFS service to fetch
   * features at a given coordinate
   * @method
   * @since 3.12.0
   * @returns {Promise} A promise which resolves to an array of ol/Feature objects
   */
  fetchFeaturesAtClick (coord, map, opts = { hitTolerance: 8 }) {
    const relativeUnits = opts.hitTolerance * map.getView().getResolution()
    const geom = olGeomPolygon.fromCircle(new olGeomCircle(coord, relativeUnits))

    return this.fetchFeaturesIntersectingGeom(geom)
  }

  /**
   * Provides a means of querying the underlying layer's WFS service to retrieve features
   * intersecting a given extent
   * @method
   * @since 3.12.0
   * @returns {Promise} A promise which resolves to an array of ol/Feature objects
   */
  fetchFeaturesIntersectingExtent (extent, opts) {
    const poly = olGeomPolygon.fromExtent(extent)

    return this.fetchFeaturesIntersectingGeom(poly, opts)
  }

  /**
   * Provides a convenient way to load layers from geoserver with easy ability to
   * filter or style the WMS component and also request the layer's WFS service to
   * retrieve features or use in applications
   * @method
   * @since 3.12.0
   * @returns {GeoserverLayer} A new instance of GeoserverLayer which can be added to the map
   */
  static fromURI (uri, opts = { getHeaders: opts => opts, isSingleTile: false }) {
    if (!uri) throw new Error('No valid uri passed to fromURI')
    const parserOpts = { getHeaders: opts.getHeaders }
    const wfsClientParser = new WFSClientParser(new WFSClient(uri, parserOpts))
    const wmsClientParser = new WMSClientParser(new WMSClient(uri, parserOpts))

    return Promise.allSettled(
      [wfsClientParser.getLayerInfo(uri), wmsClientParser.getLayerInfo()]
    ).then((results) => {
      // Throw an error if all of the requests fail
      if (results.every(({ status }) => status === 'rejected')) {
        ugh.error('There was a problem generating a GeoserverLayer with the passed layer', results)
      }
      // check the results for rejected requests and warn if some (but not all) of them failed
      results.forEach((result) => {
        if (!result || result.status === 'rejected') ugh.warn(`an error occurred while fetching layer metadata for ${uri}, the layer was successfully created but may not be fully functional: ${result?.reason}\n`, result)
      })
      const [wfsLayerInfo, wmsLayerInfo] = results.map(({ value }) => value) // extract the returned values
      const layerProto = opts.isSingleTile ? olLayerImage : olLayerTile
      const sourceProto = opts.isSingleTile ? olSourceImageWMS : olSourceTileWMS
      const { layerTitle, layerName, typeName } = wfsLayerInfo || wmsLayerInfo || {}
      const { attributes, geometryName } = wfsLayerInfo || {}
      const { extent, dimension } = wmsLayerInfo || {}

      const wmsLayer = new layerProto({
        source: new RasterSourceFactory({
          url: uri,
          gutter: 10,
          projection: 'EPSG:4326',
          wrapX: true,
          //params: { LAYERS: 'topp:tasmania_state_boundaries' },
          transition: 0,
          extent
        }, sourceProto, parserOpts),
        visible: true,
        dimension
      })

      const wfsLayer = new olLayerVector({
        source: new olSourceVector()
      })
      const parser = new SLDParser()

      // return parser
      //   .readStyle(sldBody)
      return Promise.resolve(true)
        .then(() => {
          const layerOpts = {
            uri,
            dimension,
            typeName,
            attributes,
            geometryName,
            //defaultStyles: rules,
            getHeaders: opts.getHeaders,
            initialFilterMap: opts.initialFilterMap
          }

          return new GeoserverLayer({
            layers: [wmsLayer, wfsLayer],
            title: layerTitle,
            ckan_id: opts.ckan_id
          }, layerOpts)
        })
        .catch(error => {
          // log the error from geostyler-geoserver-sld-parser & return new layer with empty default styles
          ugh.error(error)

          const layerOpts = {
            uri,
            dimension,
            typeName,
            attributes,
            geometryName,
            defaultStyles: [],
            getHeaders: opts.getHeaders,
            initialFilterMap: opts.initialFilterMap
          }

          return new GeoserverLayer({
            layers: [wmsLayer, wfsLayer],
            title: layerTitle
          }, layerOpts)
        })
    })
  }
}
