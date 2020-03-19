import React from 'react'
import { shallow, mount } from 'enzyme'
import { cleanup, fireEvent, getByText, render, waitFor } from '@testing-library/react'
import { prettyDOM } from '@testing-library/dom'
import Map from '../Map'
import StamenTerrain from './StamenTerrain'
import olMap from 'ol/map'
import olLayerVector from 'ol/layer/vector'

describe('<StamenTerrain />', async () => {
  afterEach(cleanup)
  it('should render a basic basemap option component', async () => {
    const { container } = render(<Map><StamenTerrain /></Map>)

    // wait for async child render
    await waitFor(() => {}, { container })

    expect(prettyDOM(container)).toMatchSnapshot()
  })
  it('should add a basemap to an empty map when clicked', async () => {
    const map = new olMap()
    const { container } = render(<Map map={map}><StamenTerrain /></Map>)

    // wait for async child render
    await waitFor(() => {}, { container })

    expect(map.getLayers().getArray().length).toBe(0)
    fireEvent.click(getByText(container, 'Stamen Terrain'))
    expect(map.getLayers().getArray().length).toBe(1)
  })

  it('should set the first layer to a basemap to a map containing a preexisting basemap when clicked with a string layerTypeID.', async () => {
    const mockLayerTypeID = 'mockLayerTypeID'
    const mockLayer = new olLayerVector()

    mockLayer.set(mockLayerTypeID, 'osm')

    const map = new olMap({
      layers: [
        mockLayer
      ]
    })
    const { container } = render(<Map map={map}><StamenTerrain layerTypeID={mockLayerTypeID} /></Map>)

    // wait for async child render
    await waitFor(() => {}, { container })

    expect(map.getLayers().getArray().length).toBe(1)
    fireEvent.click(getByText(container, 'Stamen Terrain'))
    expect(map.getLayers().getArray().length).toBe(1)
  })

  it('should fire the callback when the layers are changed', async () => {
    const callback = jest.fn()
    const { container } = render(<Map><StamenTerrain onBasemapChanged={callback} /></Map>)

    // wait for async child render
    await waitFor(() => {}, { container })

    expect(callback).not.toHaveBeenCalled()
    fireEvent.click(getByText(container, 'Stamen Terrain'))
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('should render a blue border to indicate when the layer is present on the map', async () => {
    const callback = jest.fn()
    const onMapInit = jest.fn()
    const wrapper = mount(<Map onMapInit={onMapInit}><StamenTerrain onBasemapChanged={callback} /></Map>)

    // wait for async child render
    await waitFor(() => expect(onMapInit).toHaveBeenCalled())
    wrapper.update()

    expect(wrapper.find('._ol_kit_basemapOption').first().prop('isActive')).toBeFalsy()
    wrapper.find('._ol_kit_basemapOption').first().simulate('click')
    expect(callback).toHaveBeenCalledTimes(1)
    expect(wrapper.find('._ol_kit_basemapOption').first().prop('isActive')).toBeTruthy()
  })
})
