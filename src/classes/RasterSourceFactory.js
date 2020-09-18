import qs from 'qs'
//import axios from 'axios'

import olSourceTileWMS from 'ol/source/tilewms'

export default class RasterSourceFactory {
  constructor (opts, Proto = olSourceTileWMS, extras = {}) {
    opts.serverType = 'geoserver'
    opts.xml = true

    // Attach the custom load functions (one for olImageWMS & the other for olTileWMS)
    opts.tileLoadFunction = this._loadFunction.bind(this)
    opts.imageLoadFunction = this._loadFunction.bind(this)

    // Create a new source from a given ol source prototpe
    this.source = new Proto(opts)

    this.source.setProperties(extras.properties)

    // save the getHeaders func & the body
    this.body = extras.body || {}
    this.extent = opts.extent
    this.getHeaders = extras.getHeaders || (a => a)

    this.source.getStyle = this.getStyle.bind(this)
    this.source.setStyle = this.setStyle.bind(this)
    this.source.setFilter = this.setFilter.bind(this)
    this.source.removeFilter = this.removeFilter.bind(this)
    this.source.getFilter = this.getFilter.bind(this)
    this.source.getExtent = this.getExtent.bind(this)
    this.source.setExtent = this.setExtent.bind(this)

    return this.source
  }

  setStyle (sld) {
    this.body.sld_body = sld

    this.source.refresh()
  }

  setFilter (cqlFilter) {
    this.body.cql_filter = cqlFilter

    this.source.refresh()
  }

  setExtent (extent) {
    this.extent = extent
  }

  removeFilter () {
    delete this.body.cql_filter
  }

  getFilter () {
    return this.body.cql_filter
  }

  getStyle () {
    return this.body.sld_body
  }

  getExtent () {
    return this.extent
  }

  _loadFunction (img, src) {
    const defaultHeaders = {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
    // this calls the getHeaders func on every request and is handy when auth headers need to be added
    const headers = this.getHeaders(defaultHeaders)

    return fetch(src, {
      method: 'POST',
      responseType: 'blob',
      headers,
      body: qs.stringify(this.body)
    })
    //return axios.post(src, qs.stringify(this.body), { responseType: 'blob', headers })
      .then(res => res.blob())
      .then(data => {
        img.getImage().src = (window.URL || window.webkitURL).createObjectURL(data)
        img.getImage().crossOrigin = 'anonymous'
      }).catch((err) => {
        // The image needs to have a src or browsers get mad
        img.getImage().src = ''

        throw err
      })
  }
}
