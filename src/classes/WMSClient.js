import olFormatWMSCapabilities from 'ol/format/wmscapabilities'
import olFormatWMSGetFeatureInfo from 'ol/format/wmsgetfeatureinfo'

const defaultHeaders = {
  'Content-Type': 'text/xml'
}

export default class WMSClient {
  constructor (url, opts = {}) {
    if (!url.length) throw new Error(`The base url (${url}) provided to WMSClient is malformed -- check the docs`)

    this.base = url
    this.getHeaders = opts.getHeaders || (a => a)
    this.dsldEndpoint = opts.dsldEndpoint
  }

  /**
   * Get the SLD body of the layer
   * @function
   * @since 3.12.0
   * @param {String} the SLD endpoint for the layer
   * @param {String} the typename of the layer
   * @returns {Promise} resolves to the catalog layers attributes
   */
  getSLDBody (typeName) {
    if (!this.dsldEndpoint) return Promise.resolve(null)

    const uri = `${this.dsldEndpoint}?typename=${typeName}`
    const headers = this.getHeaders(defaultHeaders)

    return fetch(uri, { headers })
      .then(res => {
        if (res.status !== 200) throw new Error(res.statusText)

        return res.text()
      })
  }

  getCapabilities () {
    return this._makeRequest('GetCapabilities').then((res) => {
      const format = new olFormatWMSCapabilities()

      return format.read(res)
    })
  }

  getFeatureInfo () {
    return this._makeRequest('GetFeatureInfo').then((res) => {
      const format = new olFormatWMSGetFeatureInfo()

      return format.read(res)
    })
  }

  _makeRequest (method) {
    return new Promise((resolve, reject) => {
      const uri = `${this.base}?service=WMS&request=${method}&version=1.3.0`

      return fetch(uri, { xml: true, headers: this.getHeaders() })
        .then(res => {
          if (res.status !== 200) return reject(new Error(res.status))
          return res.text()
        }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
    })
  }
}
