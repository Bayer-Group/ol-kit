import xml2js from 'xml2js'

import olFormatWFS from 'ol/format/wfs'

const defaultHeaders = {
  'Content-Type': 'text/xml'
}

/**
 * A class to WFS data
 * @class
 * @param {String} catalog layers base url
 * @returns {Promise} resolves to the requested resource from vmf api
 */
export default class WFSClient {
  constructor (url, opts = {}) {
    const baseUrlResults = /https?:\/\/.*ows/.exec(url)

    if (!baseUrlResults.length) {
      throw new Error(`The base url (${url}) provided to WFSClient is malformed -- check the docs`)
    }

    this.base = baseUrlResults[0]
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

    // return axios.get(uri, { headers })
    return fetch(uri, { headers })
      .then(res => res.json())
      .then(({ status, statusText, data }) => {
        if (status !== 200) throw new Error(statusText)
        let newData = data
        const parser = new DOMParser()
        const xmlDoc = parser.parseFromString(data, 'text/xml')

        if (xmlDoc.getElementsByTagName('WellKnownName')[0]) {
          const wellKnownName = xmlDoc.getElementsByTagName('WellKnownName')[0].childNodes[0].nodeValue

          newData = data.split(wellKnownName).join(wellKnownName.toLowerCase())
        }

        return newData
      })
  }

  /**
   * Make network requests to vmf api
   * @function
   * @since 3.12.0
   * @returns {Promise} resolves to the catalog layers capabilities
   */
  getCapabilities () {
    const body = '<GetCapabilities request="GetCapabilities" service="WFS" version="1.3.0" />'

    return this._makeRequest(body)
  }

  /**
   * Make network requests to vmf api
   * @function
   * @since 3.12.0
   * @param {String} the catalog layers typeName
   * @returns {Promise} resolves to the catalog layers attributes
   */
  describeFeatureType (typeName) {
    const body = `<DescribeFeatureType request="DescribeFeatureType" service="WFS" version="2.0.0" typeNames="${typeName}" />`

    return this._makeRequest(body)
  }

  /**
   * Make network requests to vmf api
   * @function
   * @since 3.12.0
   * @param {String} the catalog layers typeName
   * @param {Object} dataProjection and featureProjection
   * @returns {Promise} resolves to the catalog layers features
   */
  getFeatures (body, opts = {}) {
    return this._makeRequest(body.outerHTML).then((res) => {
      opts.dataProjection = opts.dataProjection || 'EPSG:4326'
      opts.featureProjection = opts.featureProjection || 'EPSG:3857'

      return res ? (new olFormatWFS()).readFeatures(res, opts) : []
    })
  }

  /**
   * Makes the network request for the specific geoserver xml body passed
   * @function
   * @since 3.12.0
   * @param {String} the body of a geoserver xml
   * @returns {Promise} resolves to the result of the geoserver body passed
   */
  _makeRequest (body) {
    const uri = `${this.base}?service=WFS`
    const parser = new xml2js.Parser({ async: false })

    const headers = this.getHeaders(defaultHeaders)

    // return axios.post(uri, body, { headers })
    return fetch(uri, { method: 'POST', headers, body })
      .then(res => res.json())
      .then(({ status, statusText, data }) => {
        if (status !== 200) throw new Error(statusText)

        return new Promise((resolve, reject) => {
          parser.parseString(data, (err, result) => {
            // geoserver stupidly returns 200s even when errors occur, so we add
            // an extra check to properly handle exceptions
            if (err) return reject(err)
            if (result.hasOwnProperty('ows:ExceptionReport')) {
              return reject(new Error(`The Geoserver request failed with an error: ${JSON.stringify(result)}`))
            }

            resolve(result)
          })
        })
      })
  }
}
