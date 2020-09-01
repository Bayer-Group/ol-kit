import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import translations from 'locales/en'
import olMap from 'ol/Map'
import LayerStyler from './LayerStyler'
import VectorLayer from '../classes/VectorLayer'
import olVectorSource from 'ol/source/Vector'
import olStyle from 'ol/style/style'
import olStroke from 'ol/style/stroke'
import olFill from 'ol/style/fill'
import olCircleStyle from 'ol/style/Circle'
import olFormatGeoJSON from 'ol/format/geojson'

const geojsonObject = {
  type: 'FeatureCollection',
  crs: {
    type: 'name',
    properties: {
      name: 'EPSG:3857'
    }
  },
  features: [{
    type: 'Feature',
    attributes: {
      data: 'testPoint'
    },
    geometry: {
      type: 'Point',
      coordinates: [0, 0]
    }
  }, {
    type: 'Feature',
    attributes: {
      data: 'testLineString'
    },
    geometry: {
      type: 'LineString',
      coordinates: [[4e6, -2e6], [8e6, 2e6]]
    }
  }, {
    type: 'Feature',
    attributes: {
      data: 'testLineString'
    },
    geometry: {
      type: 'LineString',
      coordinates: [[4e6, 2e6], [8e6, -2e6]]
    }
  }, {
    type: 'Feature',
    attributes: {
      data: 'testPolygon'
    },
    geometry: {
      type: 'Polygon',
      coordinates: [[[-5e6, -1e6], [-4e6, 1e6], [-3e6, -1e6]]]
    }
  }, {
    type: 'Feature',
    attributes: {
      data: 'testMultiLineString'
    },
    geometry: {
      type: 'MultiLineString',
      coordinates: [
        [[-1e6, -7.5e5], [-1e6, 7.5e5]],
        [[1e6, -7.5e5], [1e6, 7.5e5]],
        [[-7.5e5, -1e6], [7.5e5, -1e6]],
        [[-7.5e5, 1e6], [7.5e5, 1e6]]
      ]
    }
  }, {
    type: 'Feature',
    geometry: {
      type: 'MultiPolygon',
      coordinates: [
        [[[-5e6, 6e6], [-5e6, 8e6], [-3e6, 8e6], [-3e6, 6e6]]],
        [[[-2e6, 6e6], [-2e6, 8e6], [0, 8e6], [0, 6e6]]],
        [[[1e6, 6e6], [1e6, 8e6], [3e6, 8e6], [3e6, 6e6]]]
      ]
    }
  }, {
    type: 'Feature',
    geometry: {
      type: 'GeometryCollection',
      geometries: [{
        type: 'LineString',
        coordinates: [[-5e6, -5e6], [0, -5e6]]
      }, {
        type: 'Point',
        coordinates: [4e6, -5e6]
      }, {
        type: 'Polygon',
        coordinates: [[[1e6, -6e6], [2e6, -4e6], [3e6, -6e6]]]
      }]
    }
  }]
}

const layerStyle = feature => {
  return new olStyle({
    image: new olCircleStyle({
      radius: 4,
      fill: new olFill({ color: 'rgba(255, 0, 0, 0.4)' }),
      stroke: new olStroke({
        color: 'rgba(255, 0, 0, 0.4)',
        width: 1
      })
    })
  })
}

describe('<LayerStyler />', () => {
  it('should change an ol-kit vector layer\'s style', async done => {
    const map = new olMap()
    const source = new olVectorSource({ features: (new olFormatGeoJSON()).readFeatures(geojsonObject) })
    const title = 'Test Data'
    const vectorLayer = new VectorLayer({ source, title, style: layerStyle })

    source.getFeatures().forEach(f => f.set('testData', `${Math.random() * 100}`))

    map.addLayer(vectorLayer)

    const { getByTestId, getByText } = render(
      <div style={{ height: '100%', width: '500px', backgroundColor: 'white', position: 'absolute' }}>
        {map && <LayerStyler translations={translations} map={map} />}
      </div>, map
    )

    await waitFor(() => expect(map.getLayers().getArray().length).toBe(1))

    await waitFor(() => expect(getByTestId('StyleManager.chooseLayer')))

    fireEvent.change(getByTestId('StyleManager.chooseLayer'), { target: { value: 'Test Data' } })

    fireEvent.click(getByText('Reset Styles'))

    await waitFor(() => expect(getByTestId('StyleManager.chooseLayer').value).toBe('Test Data'))

    await waitFor(() => expect(getByText('Default Styles (1)')).toBeTruthy())

    await waitFor(() => expect(getByText('Custom Styles (0)')).toBeTruthy())

    expect(vectorLayer.getUserVectorStyles().length).toBe(0)

    const addStyle = getByTestId('LayerStyler.addStyle')

    fireEvent.click(addStyle)

    const attributeSelector = getByTestId('StyleGroup.attributeSelector')

    fireEvent.click(attributeSelector)

    fireEvent.change(attributeSelector, { target: { value: 'testData' } })

    await waitFor(() => expect(getByText('Custom Styles (1)')).toBeTruthy())

    await waitFor(() => expect(attributeSelector.value).toBe('testData'))

    await waitFor(() => expect(vectorLayer.getUserVectorStyles()).toMatchSnapshot())

    done()
  })
  it('should add a label to a layer\'s style', async done => {
    const map = new olMap()
    const source = new olVectorSource({ features: (new olFormatGeoJSON()).readFeatures(geojsonObject) })
    const title = 'Test Data'
    const vectorLayer = new VectorLayer({ source, title, style: layerStyle })

    source.getFeatures().forEach(f => f.set('testData', `${Math.random() * 100}`))

    map.addLayer(vectorLayer)

    const { getByTestId, getByText } = render(
      <div style={{ height: '100%', width: '500px', backgroundColor: 'white', position: 'absolute' }}>
        {map && <LayerStyler translations={translations} map={map} />}
      </div>, map
    )

    await waitFor(() => expect(map.getLayers().getArray().length).toBe(1))

    fireEvent.click(getByTestId('StyleManager.labelTab'))

    await waitFor(() => expect(getByText('testData')).toBeTruthy())

    fireEvent.click(getByText('testData'))

    await waitFor(() => expect(vectorLayer.getUserVectorStyles()[0].symbolizers[0].label).toBe('{{testData}}'))
    await waitFor(() => expect(vectorLayer.getUserVectorStyles()).toMatchSnapshot())

    done()
  })
})
