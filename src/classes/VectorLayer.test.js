import VectorLayer from './VectorLayer'
import olSourceVector from 'ol/source/Vector'
import olFeature from 'ol/Feature'
import olGeomPolygon from 'ol/geom/polygon'
import olFormatGeoJSON from 'ol/format/geojson'
import olStyleStyle from 'ol/style/style'
import olStyleFill from 'ol/style/fill'
import olStyleStroke from 'ol/style/stroke'
import olGeomPoint from 'ol/geom/Point'
import olStyleCircle from 'ol/style/Circle'
import olGeomLineString from 'ol/geom/LineString'

const userStyles = {
  name: 'OL Style',
  rules: [{
    name: 'OL Style Rule 0',
    symbolizers: [{
      kind: 'Mark',
      wellKnownName: 'Circle',
      color: '#FF0000',
      radius: 6
    }]
  }]
}

const defaultStyles = [{
  name: 'OL Style Rule 0',
  symbolizers: [{
    kind: 'Line',
    color: '#3399CC',
    opacity: undefined,
    width: 2,
    cap: undefined,
    join: undefined,
    dasharray: null,
    dashOffset: undefined
  }]
}]

const updatedDefaultStyles = [{
  name: 'OL Style Rule 0',
  symbolizers: [{
    kind: 'Line',
    color: '#FFFFFFF',
    opacity: undefined,
    width: 2,
    cap: undefined,
    join: undefined,
    dasharray: null,
    dashOffset: undefined
  }]
}]

describe('Vector Layer class', () => {
  it('should set polygon initial style', () => {
    const vectorLayer = new VectorLayer({
      format: new olFormatGeoJSON(),
      source: new olSourceVector({
        features: [new olFeature({
          geometry: new olGeomPolygon([[
            [-104.05, 48.99],
            [-97.22, 48.98],
            [-96.58, 45.94],
            [-104.03, 45.94],
            [-104.05, 48.99]]])
        })]
      })
    })

    const receivedStyle = vectorLayer.getStyle()()
    const expectedStyle = [new olStyleStyle({
      fill: new olStyleFill({ color: 'rgba(255,255,255,1)' }),
      stroke: new olStyleStroke({ color: '#3399CC', width: 2 })
    })]

    expect([...receivedStyle]).toMatchObject(expectedStyle)
  })

  it('should set point initial style', () => {
    const vectorLayer = new VectorLayer({
      format: new olFormatGeoJSON(),
      source: new olSourceVector({
        features: [new olFeature({
          geometry: new olGeomPoint([[-104.05, 48.99]])
        })]
      })
    })

    const receivedStyle = vectorLayer.getStyle()()
    const expectedStyle = [new olStyleStyle({
      image: new olStyleCircle({
        fill: new olStyleFill({ color: 'rgba(255,255,255,1)' }),
        stroke: new olStyleStroke({ color: '#3399CC', width: 2 }),
        radius: 5,
        snapToPixel: true
      })
    })]

    expect([...receivedStyle]).toMatchObject(expectedStyle)
  })

  it('should set linestring initial style', () => {
    const vectorLayer = new VectorLayer({
      format: new olFormatGeoJSON(),
      source: new olSourceVector({
        features: [new olFeature({
          geometry: new olGeomLineString([[-104.05, 48.99], [-97.22, 48.98]])
        })]
      })
    })

    const receivedStyle = vectorLayer.getStyle()()
    const expectedStyle = [new olStyleStyle({
      stroke: new olStyleStroke({ color: '#3399CC', width: 2 })
    })]

    expect([...receivedStyle]).toMatchObject(expectedStyle)
  })

  it('should get attributes and values from vectorLayer', () => {
    const vectorLayer = new VectorLayer({
      format: new olFormatGeoJSON(),
      source: new olSourceVector({
        features: [
          new olFeature({
            geometry: new olGeomLineString([[-104.05, 48.99], [-97.22, 48.98]]),
            city: 'kc'
          }),
          new olFeature({
            geometry: new olGeomLineString([[-104.05, 48.99], [-97.22, 48.98]]),
            city: 'stl'
          })
        ]
      })
    })

    expect(vectorLayer.getAttributes()).toMatchObject(['geometry', 'city'])
    expect(vectorLayer.fetchValuesForAttribute('city')).toMatchObject(['kc', 'stl'])
  })

  it('should set user styles', () => {
    const vectorLayer = new VectorLayer({
      format: new olFormatGeoJSON(),
      source: new olSourceVector({
        features: [new olFeature({
          geometry: new olGeomLineString([[-104.05, 48.99], [-97.22, 48.98]])
        })]
      })
    })

    vectorLayer.setUserVectorStyles(userStyles.rules)
    expect(vectorLayer.getUserVectorStyles()).toMatchObject(userStyles.rules)
  })

  it('should set, update and reset default styles', async () => {
    const vectorLayer = new VectorLayer({
      format: new olFormatGeoJSON(),
      source: new olSourceVector({
        features: [new olFeature({
          geometry: new olGeomLineString([[-104.05, 48.99], [-97.22, 48.98]])
        })]
      })
    })

    await vectorLayer.setDefaultVectorStyles()
    expect(vectorLayer.getDefaultVectorStyles()).toMatchObject(defaultStyles)

    vectorLayer.updateDefaultVectorStyles(updatedDefaultStyles)
    expect(vectorLayer.getDefaultVectorStyles()).toMatchObject(updatedDefaultStyles)

    vectorLayer.resetDefaultVectorStyles()
    expect(vectorLayer.getDefaultVectorStyles()).toMatchObject(defaultStyles)
  })

  it('should write default and user styles to ol styles', async () => {
    const vectorLayer = new VectorLayer({
      format: new olFormatGeoJSON(),
      source: new olSourceVector({
        features: [new olFeature({
          geometry: new olGeomLineString([[-104.05, 48.99], [-97.22, 48.98]])
        })]
      })
    })

    await vectorLayer.setDefaultVectorStyles()
    vectorLayer.setUserVectorStyles(userStyles.rules)

    await vectorLayer._applyVectorStyles()
    expect(vectorLayer.getStyle()().length).toBe(2)
  })
})
