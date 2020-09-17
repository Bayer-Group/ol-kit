import { parseExtent } from 'utils/geoserver'

/**
 * A utility class which uses a wmsClient class to retrieve layer info
 * @class
 * @since 3.12.0
 * @param {Object} instance of wmsClient
 */
export default class wmsClientParser {
  constructor (wmsClient) {
    this.client = wmsClient
  }

  getIdentiferForItem (uri) {
    const parts = uri.split('/')
    const length = parts.length

    const typeName = `${parts[length - 3]}:${parts[length - 2]}`
    const title = parts[length - 2]

    // for tile layers, they do not have a typename, see below for example uri:
    // https://api01-np.agro.services/loc360/openweathermap/tile/map/precipitation_new/{z}/{x}/{y}.png
    if (typeName === '{z}:{x}') return parts[parts.length - 4]

    return { typeName, title }
  }

  /**
   * Uses the WMSClient to return layer info
   * @function
   * @since 3.12.0
   * @returns {Object} the layers typename, attributes and geometryName
   */
  getLayerInfo () {
    return this.client.getCapabilities().then((capabilities) => {
      const layerProps = capabilities.Capability.Layer.Layer[0]
      const layerName = layerProps.Name
      const layerTitle = layerProps.Title
      const dimension = layerProps.Dimension || undefined
      const extent = parseExtent(layerProps, 'EPSG:3857')
      const { typeName } = this.getIdentiferForItem(this.client.base)

      return Promise.all([
        typeName,
        layerName,
        layerTitle,
        extent,
        this.client.getSLDBody(typeName),
        dimension
      ])
    }).then(([typeName, layerName, layerTitle, extent, sldBody, dimension]) => {
      return {
        sldBody,
        typeName,
        layerName,
        layerTitle,
        extent,
        dimension
      }
    })
  }
}
