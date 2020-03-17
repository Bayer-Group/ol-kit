import React from 'react'
import { shallow, mount } from 'enzyme'
import BingMaps from './BingMaps'
import Map from '../Map'
import olMap from 'ol/map'
import olLayerVector from 'ol/layer/vector'

const mockSourceOpts = {
  key: ''
}
const mountOpts = props => ({
  wrappingComponent: Map,
  wrappingComponentProps: {
    allowAsyncMount: false, // this forces wrappingComponent to render children immediately
    ...props
  }
})

describe.only('<BingMaps />', () => {
  it('should render a basic basemap option component', () => {
    const wrapper = shallow(<BingMaps sourceOpts={mockSourceOpts} />, mountOpts())

    expect(wrapper).toMatchSnapshot()
  })

  it('should require a key', () => {
    const map = new olMap()
    const wrapper = shallow(<BingMaps map={map} sourceOpts={{ key: undefined }} />)

    expect(wrapper).toThrowErrorMatchingSnapshot()
  })

  it('should add a basemap to an empty map when clicked', () => {
    const map = new olMap()
    const wrapper = mount(<BingMaps map={map} sourceOpts={mockSourceOpts} />)

    expect(map.getLayers().getArray().length).toBe(0)

    wrapper.simulate('click')
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
