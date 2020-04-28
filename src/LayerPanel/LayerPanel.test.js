import React from 'react'
import { render, waitFor, fireEvent } from '@testing-library/react'
import olFeature from 'ol/feature'
import olLayerVector from 'ol/layer/vector'
import olPoint from 'ol/geom/point'
import olSourceVector from 'ol/source/vector'
import { Map } from 'Map'
import { LayerPanel } from 'LayerPanel'

describe('<LayerPanel />', () => {
  it('should filter out basemap', async () => {
    let testMap
    const onMapInit = jest.fn(map => {
      testMap = map
    })

    const { getByText, getByTestId } = render(<Map onMapInit={onMapInit}><LayerPanel /></Map>)

    // wait for async child render
    await waitFor(() => expect(onMapInit).toHaveBeenCalled())

    fireEvent.click(getByTestId('LayerPanel.openTab'))

    // add a feature to that map at a known pixel location
    const features = [new olFeature(new olPoint([-97.75, 30.265]))]

    const source = new olSourceVector({ features })
    const vectorLayer = new olLayerVector({ source })

    vectorLayer.set('title', 'My Custom Layer')
    testMap.addLayer(vectorLayer)
    testMap.getLayers().getArray()[0].set('title', 'My Basemap')

    expect(testMap.getLayers().getArray().length).toBe(2)

    await waitFor(() => expect(getByText('My Custom Layer')).toBeInTheDocument())
  })
  it('should toggle visibility on checkbox click', async () => {
    let testMap
    const onMapInit = jest.fn(map => {
      testMap = map
    })

    const { getByTestId, getAllByTestId } = render(<Map onMapInit={onMapInit}><LayerPanel /></Map>)

    // wait for async child render
    await waitFor(() => expect(onMapInit).toHaveBeenCalled())

    fireEvent.click(getByTestId('LayerPanel.openTab'))

    // add a feature to that map at a known pixel location
    const features = [new olFeature(new olPoint([-97.75, 30.265]))]

    const source = new olSourceVector({ features })
    const vectorLayer = new olLayerVector({ source })
    const vectorLayer2 = new olLayerVector({ source })

    vectorLayer.set('title', 'My Custom Layer')
    vectorLayer2.set('title', 'My Second Custom Layer')
    testMap.addLayer(vectorLayer2)
    testMap.addLayer(vectorLayer)

    const checkboxes = getAllByTestId('LayerPanel.checkbox')

    fireEvent.click(checkboxes[0])

    // make sure the basemap is still visible and that the only layer rendered in the layer panel is not visible
    expect(testMap.getLayers().getArray()[0].getVisible()).toBe(true)
    expect(testMap.getLayers().getArray()[1].getVisible()).toBe(false)
    expect(testMap.getLayers().getArray()[2].getVisible()).toBe(false)

    fireEvent.click(checkboxes[0])

    // make sure the basemap is still visible and that the only layer rendered in the layer panel is not visible
    expect(testMap.getLayers().getArray()[0].getVisible()).toBe(true)
    expect(testMap.getLayers().getArray()[1].getVisible()).toBe(true)
    expect(testMap.getLayers().getArray()[2].getVisible()).toBe(true)

    fireEvent.click(checkboxes[1])

    expect(testMap.getLayers().getArray()[0].getVisible()).toBe(true)
    expect(testMap.getLayers().getArray()[1].getVisible()).toBe(true)
    expect(testMap.getLayers().getArray()[2].getVisible()).toBe(false)
    expect(getByTestId('LayerPanel.indeterminateCheckbox')).toBeInTheDocument()

    fireEvent.click(checkboxes[0])
    expect(testMap.getLayers().getArray()[0].getVisible()).toBe(true)
    expect(testMap.getLayers().getArray()[1].getVisible()).toBe(true)
    expect(testMap.getLayers().getArray()[2].getVisible()).toBe(true)
  })
  it('should remove Layers from action bar', async () => {
    let testMap
    const onMapInit = jest.fn(map => {
      testMap = map
    })

    const { getByTestId, getAllByTestId, getByText } = render(<Map onMapInit={onMapInit}><LayerPanel /></Map>)

    // wait for async child render
    await waitFor(() => expect(onMapInit).toHaveBeenCalled())

    fireEvent.click(getByTestId('LayerPanel.openTab'))

    // add a feature to that map at a known pixel location
    const features = [new olFeature(new olPoint([-97.75, 30.265]))]

    const source = new olSourceVector({ features })
    const vectorLayer = new olLayerVector({ source })
    const vectorLayer2 = new olLayerVector({ source })

    vectorLayer.set('title', 'My Custom Layer')
    vectorLayer2.set('title', 'My Second Custom Layer')
    testMap.addLayer(vectorLayer2)
    testMap.addLayer(vectorLayer)

    const actions = getAllByTestId('LayerPanel.actions')

    fireEvent.click(actions[0])
    await waitFor(() => expect(getByText('Remove Layers')).toBeInTheDocument())

    fireEvent.click(getByText('Remove Layers'))

    // should still have the basemap
    expect(testMap.getLayers().getArray().length).toBe(1)

    testMap.addLayer(vectorLayer2)
    testMap.addLayer(vectorLayer)

    // basemap is on the map still to +1
    expect(testMap.getLayers().getArray().length).toBe(3)

    const checkboxes = getAllByTestId('LayerPanel.checkbox')

    fireEvent.click(checkboxes[1])

    // make sure the layer that was toggled off is not removed
    fireEvent.click(actions[0])
    await waitFor(() => expect(getByText('Remove Layers')).toBeInTheDocument())

    fireEvent.click(getByText('Remove Layers'))

    // should still have the basemap
    expect(testMap.getLayers().getArray().length).toBe(2)
    await waitFor(() => expect(getByText('My Second Custom Layer')).toBeInTheDocument())
  })

  it('should render features', async () => {
    let testMap
    const onMapInit = jest.fn(map => {
      testMap = map
    })

    const { getByTestId, getAllByTestId, getByText } = render(<Map onMapInit={onMapInit}><LayerPanel /></Map>)

    // wait for async child render
    await waitFor(() => expect(onMapInit).toHaveBeenCalled())

    fireEvent.click(getByTestId('LayerPanel.openTab'))

    // add a feature to that map at a known pixel location
    const features = [new olFeature(new olPoint([-97.75, 30.265])), new olFeature(new olPoint([-99.75, 35.265]))]

    const source = new olSourceVector({ features })
    const vectorLayer = new olLayerVector({ source })

    vectorLayer.set('title', 'My Custom Layer')
    testMap.addLayer(vectorLayer)

    fireEvent.click(getByTestId('LayerPanel.expandLayer'))

    await waitFor(() => expect(getByText('feature 0')).toBeInTheDocument())

    const checkboxes = getAllByTestId('LayerPanel.checkbox')

    fireEvent.click(checkboxes[2])

    expect(getAllByTestId('LayerPanel.indeterminateCheckbox').length).toBe(2)
  })
})
