import React from 'react'
import { shallow, mount } from 'enzyme'
import StamenTonerDark from './StamenTonerDark'
import Map from '../Map'
import olMap from 'ol/map'
import olLayerVector from 'ol/layer/vector'

describe('<StamenTonerDark />', () => {
  it('should render a basic basemap option component', (done) => {
    const onMapInit = jest.fn(map => {
      expect(wrapper).toMatchSnapshot()
      done()
    })
    const wrapper = shallow(<Map onMapInit={onMapInit}><StamenTonerDark /></Map>)
  })
  it('should add a basemap to an empty map when clicked', (done) => {
    const onMapInit = map => {
      expect(map.getLayers().getArray().length).toBe(0)
      wrapper.simulate('click')
      expect(map.getLayers().getArray().length).toBe(1)
      done()
    }
    const map = new olMap()
    const wrapper = mount(<Map map={map} onMapInit={onMapInit}><StamenTonerDark /></Map>)
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
    const wrapper = mount(<StamenTonerDark map={map} layerTypeID={mockLayerTypeID} />, { wrappingComponent: Map })

    expect(map.getLayers().getArray().length).toBe(1)

    wrapper.simulate('click')
    expect(map.getLayers().getArray().length).toBe(1)
  })

  it('should fire the callback when the layers are changed', () => {
    const map = new olMap()
    const callback = jest.fn()
    const wrapper = mount(<StamenTonerDark map={map} onBasemapChanged={callback} />, { wrappingComponent: Map })

    expect(callback).not.toHaveBeenCalled()
    wrapper.simulate('click')
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('should render a blue border to indicate when the layer is present on the map', () => {
    const callback = jest.fn()
    const map = new olMap()
    const wrapper = mount(<StamenTonerDark map={map} onBasemapChanged={callback} />, { wrappingComponent: Map })

    expect(wrapper.find('._ol_kit_basemapOption').first().prop('isActive')).toBeFalsy()
    wrapper.simulate('click')
    expect(callback).toHaveBeenCalledTimes(1)
    expect(wrapper.find('._ol_kit_basemapOption').first().prop('isActive')).toBeTruthy()
  })
})
