import React from 'react'
import { shallow, mount } from 'enzyme'
import { fireEvent, getByText, render, waitFor } from '@testing-library/react'
import { prettyDOM } from '@testing-library/dom'
import { mountOpts } from 'index.test'
import Map from '../Map'
import BingMaps from './BingMaps'
import olMap from 'ol/map'
import olLayerVector from 'ol/layer/vector'

const mockSourceOpts = {
  key: ''
}

describe('<BingMaps />', () => {
  it('should render a basic basemap option component', async () => {
    const onMapInit = jest.fn()
    const { wrapper } = render(<Map onMapInit={onMapInit}><BingMaps sourceOpts={mockSourceOpts} /></Map>)

    await waitFor(() => expect(onMapInit).toHaveBeenCalled())

    expect(prettyDOM(wrapper)).toMatchSnapshot()
  })

  it('should require a key', async () => {
    const map = new olMap()
    const onMapInit = jest.fn()
    const { wrapper } = render(<Map map={map} onMapInit={onMapInit}><BingMaps sourceOpts={{ key: undefined }} /></Map>)

    await waitFor(() => expect(onMapInit).toHaveBeenCalled())

    expect(prettyDOM(wrapper)).toMatchSnapshot()
  })

  it('should add a basemap to an empty map when clicked', async () => {
    const map = new olMap()
    const onMapInit = jest.fn()
    const MapWrapper = props => <Map map={map} onMapInit={onMapInit} {...props} />
    const { container } = render(<BingMaps sourceOpts={mockSourceOpts} />, { wrapper: MapWrapper })

    await waitFor(() => expect(onMapInit).toHaveBeenCalled())

    expect(map.getLayers().getArray().length).toBe(0)

    fireEvent.click(getByText(container, 'Bing Maps'))
    expect(map.getLayers().getArray().length).toBe(1)
  })

  it('should set the first layer to a basemap to a map containing a preexisting basemap when clicked with a string layerTypeID.', () => {
    const mockLayerTypeID = 'mockLayerTypeID'
    const mockLayer = new olLayerVector()

    mockLayer.set(mockLayerTypeID, 'osm')

    const map = new olMap({
      layers: [
        mockLayer
      ]
    })
    const wrapper = mount(<BingMaps sourceOpts={mockSourceOpts} layerTypeID={mockLayerTypeID} />, mountOpts({ map }))

    expect(map.getLayers().getArray().length).toBe(1)

    wrapper.simulate('click')
    expect(map.getLayers().getArray().length).toBe(1)
  })

  it('should fire the callback when the layers are changed', () => {
    const map = new olMap()
    const callback = jest.fn()
    const wrapper = mount(<BingMaps sourceOpts={mockSourceOpts} onBasemapChanged={callback} />, mountOpts({ map }))

    expect(callback).not.toHaveBeenCalled()
    wrapper.simulate('click')
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('should render a blue border to indicate when the layer is present on the map', () => {
    const callback = jest.fn()
    const map = new olMap()
    const wrapper = mount(<BingMaps sourceOpts={mockSourceOpts} onBasemapChanged={callback} />, mountOpts({ map }))

    expect(wrapper.find('._ol_kit_basemapOption').first().prop('isActive')).toBeFalsy()
    wrapper.simulate('click')
    expect(callback).toHaveBeenCalledTimes(1)
    expect(wrapper.find('._ol_kit_basemapOption').first().prop('isActive')).toBeTruthy()
  })
})
