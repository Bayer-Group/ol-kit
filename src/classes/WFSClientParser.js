const gmlGeometryTypes = [
  'gml:CurvePropertyType',
  'gml:MultiGeometryPropertyType',
  'gml:GeometryPropertyType',
  'gml:GeometryArrayPropertyType',
  'gml:PointPropertyType',
  'gml:PointArrayPropertyType',
  'gml:CurveArrayPropertyType',
  'gml:SurfacePropertyType',
  'gml:SurfaceArrayPropertyType',
  'gml:SolidPropertyType',
  'gml:SolidArrayPropertyType',
  'gml:MultiPointPropertyType',
  'gml:MultiSurfacePropertyType',
  'gml:MultiCurvePropertyType',
  'gml:LineStringPropertyType',
  'gml:PolygonPropertyType'
]

/**
 * A utility class which uses a WFSCLient class to retrieve layer info
 * @class
 * @since 3.12.0
 * @param {Object} instance of WFSClient
 */
export default class WFSClientParser {
  constructor (wfsClient) {
    this.client = wfsClient
  }

  getIdentiferForItem (uri) {
    const parts = uri.split('/')
    const length = parts.length

    const typename = `${parts[length - 3]}:${parts[length - 2]}`
    const title = parts[length - 2]

    // for tile layers, they do not have a typename, see below for example uri:
    // https://api01-np.agro.services/loc360/openweathermap/tile/map/precipitation_new/{z}/{x}/{y}.png
    if (typename === '{z}:{x}') return parts[parts.length - 4]

    return { typename, title }
  }

  /**
   * Uses the WFSClient to return layer info
   * @function
   * @since 3.12.0
   * @returns {Object} the layers typename, attributes and geometryName
   */
  getLayerInfo (uri, dsldEndpoint) {
    return this.client.getCapabilities().then((res) => {
      const { typename, title } = this.getIdentiferForItem(uri)
      const capabilities = res['wfs:WFS_Capabilities']

      // the typename is commonly used by geoserver to identify a layer
      const typeName = capabilities.FeatureTypeList ? capabilities.FeatureTypeList[0].FeatureType[0].Name[0] : typename
      const layerTitle = capabilities.FeatureTypeList ? capabilities.FeatureTypeList[0].FeatureType[0].Title[0] : title

      return Promise.all([
        typeName,
        layerTitle,
        this.client.getSLDBody(typeName),
        this.client.describeFeatureType(typeName)
      ])
    }).then(([typeName, layerTitle, sldBody, typeDescription]) => {
      // we assume the default geom column is geometry but we check later and set otherwise
      let geometryName = 'geometry'

      let attributes = []

      if (typeDescription['xsd:schema']['xsd:complexType']) {
        const rawAttributes = typeDescription['xsd:schema']['xsd:complexType']['0']['xsd:complexContent']['0']['xsd:extension']['0']['xsd:sequence']['0']['xsd:element']

        attributes = rawAttributes.map(attr => {
          // if we find the layer's actual geom column, set it to geometryName
          if (gmlGeometryTypes.includes(attr.$.type)) {
            geometryName = attr.$.name
          }

          return attr.$.name
        })
      }

      return {
        sldBody,
        typeName,
        attributes,
        geometryName,
        layerTitle
      }
    })
  }
}
