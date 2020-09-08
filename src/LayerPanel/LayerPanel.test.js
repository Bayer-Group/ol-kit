// import React from 'react'
// import { render, waitFor, fireEvent } from '@testing-library/react'
// import olFeature from 'ol/Feature'
// import olLayerVector from 'ol/layer/Vector'
// import olPoint from 'ol/geom/Point'
// import olSourceVector from 'ol/source/Vector'
// import olFormatGeoJSON from 'ol/format/geojson'
// import { Map } from 'Map'
// import { LayerPanel } from 'LayerPanel'
// const fs = require('fs')

// const testGeoJSONData = {
//   type: 'FeatureCollection',
//   crs: {
//     type: 'name',
//     properties: {
//       name: 'EPSG:3857'
//     }
//   },
//   features: [{
//     type: 'Feature',
//     geometry: {
//       type: 'Point',
//       coordinates: [0, 0]
//     }
//   }, {
//     type: 'Feature',
//     geometry: {
//       type: 'MultiPoint',
//       coordinates: [[-2e6, 0], [0, -2e6]]
//     }
//   }, {
//     type: 'Feature',
//     geometry: {
//       type: 'LineString',
//       coordinates: [[4e6, -2e6], [8e6, 2e6], [9e6, 2e6]]
//     }
//   }, {
//     type: 'Feature',
//     geometry: {
//       type: 'LineString',
//       coordinates: [[4e6, -2e6], [8e6, 2e6], [8e6, 3e6]]
//     }
//   }, {
//     type: 'Feature',
//     geometry: {
//       type: 'Polygon',
//       coordinates: [[[-5e6, -1e6], [-4e6, 1e6],
//         [-3e6, -1e6], [-5e6, -1e6]], [[-4.5e6, -0.5e6],
//         [-3.5e6, -0.5e6], [-4e6, 0.5e6], [-4.5e6, -0.5e6]]]
//     }
//   }, {
//     type: 'Feature',
//     geometry: {
//       type: 'MultiLineString',
//       coordinates: [
//         [[-1e6, -7.5e5], [-1e6, 7.5e5]],
//         [[-1e6, -7.5e5], [-1e6, 7.5e5], [-5e5, 0], [-1e6, -7.5e5]],
//         [[1e6, -7.5e5], [15e5, 0], [15e5, 0], [1e6, 7.5e5]],
//         [[-7.5e5, -1e6], [7.5e5, -1e6]],
//         [[-7.5e5, 1e6], [7.5e5, 1e6]]
//       ]
//     }
//   }, {
//     type: 'Feature',
//     geometry: {
//       type: 'MultiPolygon',
//       coordinates: [
//         [[[-5e6, 6e6], [-5e6, 8e6], [-3e6, 8e6],
//           [-3e6, 6e6], [-5e6, 6e6]]],
//         [[[-3e6, 6e6], [-2e6, 8e6], [0, 8e6],
//           [0, 6e6], [-3e6, 6e6]]],
//         [[[1e6, 6e6], [1e6, 8e6], [3e6, 8e6],
//           [3e6, 6e6], [1e6, 6e6]]]
//       ]
//     }
//   }, {
//     type: 'Feature',
//     geometry: {
//       type: 'GeometryCollection',
//       geometries: [{
//         type: 'LineString',
//         coordinates: [[-5e6, -5e6], [0, -5e6]]
//       }, {
//         type: 'Point',
//         coordinates: [4e6, -5e6]
//       }, {
//         type: 'Polygon',
//         coordinates: [
//           [[1e6, -6e6], [2e6, -4e6], [3e6, -6e6], [1e6, -6e6]]
//         ]
//       }]
//     }
//   }]
// }

// describe('<LayerPanel />', () => {
//   it('should filter out basemap', async () => {
//     let testMap
//     const onMapInit = jest.fn(map => {
//       testMap = map
//     })

//     const { getByText, getByTestId } = render(<Map onMapInit={onMapInit}><LayerPanel /></Map>)

//     // wait for async child render
//     await waitFor(() => expect(onMapInit).toHaveBeenCalled())

//     fireEvent.click(getByTestId('LayerPanel.open'))

//     // add a feature to that map at a known pixel location
//     const features = [new olFeature(new olPoint([-97.75, 30.265]))]
//     const source = new olSourceVector({ features })
//     const vectorLayer = new olLayerVector({ source })

//     vectorLayer.set('title', 'My Custom Layer')
//     testMap.addLayer(vectorLayer)
//     const basemap = testMap.getLayers().getArray().find(layer => layer.get('_ol_kit_basemap'))

//     basemap.set('title', 'My Basemap')

//     expect(testMap.getLayers().getArray().length).toBe(2)

//     await waitFor(() => expect(getByText('My Custom Layer')).toBeInTheDocument())
//   })
//   it('should toggle visibility on checkbox click', async () => {
//     let testMap
//     const onMapInit = jest.fn(map => {
//       testMap = map
//     })

//     const { getByTestId, getAllByTestId } = render(<Map onMapInit={onMapInit}><LayerPanel /></Map>)

//     // wait for async child render
//     await waitFor(() => expect(onMapInit).toHaveBeenCalled())

//     fireEvent.click(getByTestId('LayerPanel.open'))

//     // add a feature to that map at a known pixel location
//     const features = [new olFeature(new olPoint([-97.75, 30.265]))]

//     const source = new olSourceVector({ features })
//     const vectorLayer = new olLayerVector({ source })
//     const vectorLayer2 = new olLayerVector({ source })

//     vectorLayer.set('title', 'My Custom Layer')
//     vectorLayer2.set('title', 'My Second Custom Layer')
//     testMap.addLayer(vectorLayer2)
//     testMap.addLayer(vectorLayer)

//     const checkboxes = getAllByTestId('LayerPanel.checked')

//     fireEvent.click(checkboxes[0])

//     // make sure the basemap is still visible and that the only layer rendered in the layer panel is not visible
//     expect(testMap.getLayers().getArray()[0].getVisible()).toBe(true)
//     expect(testMap.getLayers().getArray()[1].getVisible()).toBe(false)
//     expect(testMap.getLayers().getArray()[2].getVisible()).toBe(false)

//     fireEvent.click(checkboxes[0])

//     // make sure the basemap is still visible and that the only layer rendered in the layer panel is not visible
//     expect(testMap.getLayers().getArray()[0].getVisible()).toBe(true)
//     expect(testMap.getLayers().getArray()[1].getVisible()).toBe(true)
//     expect(testMap.getLayers().getArray()[2].getVisible()).toBe(true)

//     fireEvent.click(checkboxes[1])

//     // when we toggle visibility of one but not all layers the mastercheckbox should be indeterminate
//     expect(testMap.getLayers().getArray()[0].getVisible()).toBe(true)
//     expect(testMap.getLayers().getArray()[1].getVisible()).toBe(true)
//     expect(testMap.getLayers().getArray()[2].getVisible()).toBe(false)
//     expect(getByTestId('LayerPanel.indeterminateCheckbox')).toBeInTheDocument()

//     fireEvent.click(checkboxes[0])
//     expect(testMap.getLayers().getArray()[0].getVisible()).toBe(true)
//     expect(testMap.getLayers().getArray()[1].getVisible()).toBe(true)
//     expect(testMap.getLayers().getArray()[2].getVisible()).toBe(true)
//   })
//   it('should remove Layers from action bar', async () => {
//     let testMap
//     const onMapInit = jest.fn(map => {
//       testMap = map
//     })

//     const { getByTestId, getAllByTestId, getByText } = render(<Map onMapInit={onMapInit}><LayerPanel /></Map>)

//     // wait for async child render
//     await waitFor(() => expect(onMapInit).toHaveBeenCalled())

//     fireEvent.click(getByTestId('LayerPanel.open'))

//     // add a feature to that map at a known pixel location
//     const features = [new olFeature(new olPoint([-97.75, 30.265]))]

//     const source = new olSourceVector({ features })
//     const vectorLayer = new olLayerVector({ source })
//     const vectorLayer2 = new olLayerVector({ source })

//     vectorLayer.set('title', 'My Custom Layer')
//     vectorLayer2.set('title', 'My Second Custom Layer')
//     testMap.addLayer(vectorLayer2)
//     testMap.addLayer(vectorLayer)

//     const actions = getAllByTestId('LayerPanel.actionsButton')

//     fireEvent.click(actions[0])
//     await waitFor(() => expect(getByText('Remove Layers')).toBeInTheDocument())

//     fireEvent.click(getByText('Remove Layers'))

//     // should still have the basemap
//     expect(testMap.getLayers().getArray().length).toBe(1)

//     testMap.addLayer(vectorLayer2)
//     testMap.addLayer(vectorLayer)

//     // basemap is on the map still to +1
//     expect(testMap.getLayers().getArray().length).toBe(3)

//     const checkboxes = getAllByTestId('LayerPanel.unchecked')

//     fireEvent.click(checkboxes[1])

//     // make sure the layer that was toggled off is not removed
//     fireEvent.click(actions[0])
//     await waitFor(() => expect(getByText('Remove Layers')).toBeInTheDocument())

//     fireEvent.click(getByText('Remove Layers'))

//     // should still have the basemap
//     expect(testMap.getLayers().getArray().length).toBe(2)
//     await waitFor(() => expect(getByText('My Second Custom Layer')).toBeInTheDocument())
//   })

//   it('should render features', async () => {
//     let testMap
//     const onMapInit = jest.fn(map => {
//       testMap = map
//     })

//     const { getByTestId, getAllByTestId, getByText } = render(<Map onMapInit={onMapInit}><LayerPanel /></Map>)

//     // wait for async child render
//     await waitFor(() => expect(onMapInit).toHaveBeenCalled())

//     fireEvent.click(getByTestId('LayerPanel.open'))

//     // add a feature to that map at a known pixel location
//     const features = [new olFeature(new olPoint([-97.75, 30.265])), new olFeature(new olPoint([-99.75, 35.265]))]

//     features[0].set('name', 'My map feature')

//     const source = new olSourceVector({ features })
//     const vectorLayer = new olLayerVector({ source })

//     vectorLayer.set('title', 'My Custom Layer')
//     testMap.addLayer(vectorLayer)

//     fireEvent.click(getByTestId('LayerPanel.expandLayer'))

//     await waitFor(() => expect(getByText('My map feature')).toBeInTheDocument())

//     const checkboxes = getAllByTestId('LayerPanel.checked')

//     fireEvent.click(checkboxes[2])

//     // when we toggle visibility of one but not all features the mastercheckbox and the layers checkbox should be indeterminate
//     expect(getAllByTestId('LayerPanel.indeterminateCheckbox').length).toBe(2)
//   })

//   it('should export GeoJSON data', async () => {
//     const mockCreateFn = global.URL.createObjectURL = jest.fn()
//     const mockRevokeFn = global.URL.revokeObjectURL = jest.fn()

//     let testMap
//     const onMapInit = jest.fn(map => {
//       testMap = map
//     })

//     const { getByTestId, getAllByTestId } = render(<Map onMapInit={onMapInit}><LayerPanel /></Map>)

//     // wait for async child render
//     await waitFor(() => expect(onMapInit).toHaveBeenCalled())

//     fireEvent.click(getByTestId('LayerPanel.open'))

//     const vectorSource = new olSourceVector({
//       features: (new olFormatGeoJSON()).readFeatures(testGeoJSONData)
//     })
//     const vectorLayer = new olLayerVector({
//       title: 'TestLayer',
//       mode: 'image',
//       source: vectorSource
//     })

//     testMap.addLayer(vectorLayer)

//     const actions = getAllByTestId('LayerPanel.actionsButton')

//     fireEvent.click(actions[0])
//     fireEvent.click(getByTestId('LayerPanel.exportGeoJSON'))

//     const download = fs.readFileSync('export.geojson', { encoding: 'utf8' })

//     expect(download).toMatchSnapshot()
//     fs.unlink('./export.geojson', jest.fn())
//     await waitFor(() => expect(mockCreateFn).toHaveBeenCalled()) // creates an object url
//     // await waitFor(() => expect(getByTestId('Export.download')).toBeInTheDocument()) // expects the <a> node to be appended
//     await waitFor(() => expect(mockRevokeFn).toHaveBeenCalled()) // cleans up the object url
//   })

//   it('should export KML data', async () => {
//     const mockCreateFn = global.URL.createObjectURL = jest.fn()
//     const mockRevokeFn = global.URL.revokeObjectURL = jest.fn()

//     let testMap
//     const onMapInit = jest.fn(map => {
//       testMap = map
//     })

//     const { getByTestId, getAllByTestId } = render(<Map onMapInit={onMapInit}><LayerPanel /></Map>)

//     // wait for async child render
//     await waitFor(() => expect(onMapInit).toHaveBeenCalled())

//     fireEvent.click(getByTestId('LayerPanel.open'))

//     const vectorSource = new olSourceVector({
//       features: (new olFormatGeoJSON()).readFeatures(testGeoJSONData)
//     })
//     const vectorLayer = new olLayerVector({
//       title: 'TestLayer',
//       mode: 'image',
//       source: vectorSource
//     })

//     testMap.addLayer(vectorLayer)

//     const actions = getAllByTestId('LayerPanel.actionsButton')

//     fireEvent.click(actions[0])
//     fireEvent.click(getByTestId('LayerPanel.exportKML'))

//     const download = fs.readFileSync('export.kml', { encoding: 'utf8' })

//     expect(download).toMatchSnapshot()
//     fs.unlink('export.kml', jest.fn())
//     await waitFor(() => expect(mockCreateFn).toHaveBeenCalled()) // creates an object url
//     // await waitFor(() => expect(getByTestId('Export.download')).toBeInTheDocument()) // expects the <a> node to be appended
//     await waitFor(() => expect(mockRevokeFn).toHaveBeenCalled()) // cleans up the object url
//   })
// })
