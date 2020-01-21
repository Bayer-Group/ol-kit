import React from 'react'
import { mount } from 'enzyme'
import olMap from 'ol/map'
import Map from './Map'

describe('<Map />', () => {
  it('should render with a map prop', () => {
    const mockMap = new olMap()
    const onMapInit = jest.fn()
    const wrapper = mount(<Map map={mockMap} onMapInit={onMapInit} />)

    expect(onMapInit).not.toHaveBeenCalled()
  })

  it('should render with onMapInit callback', () => {
    const onMapInit = jest.fn()
    const wrapper = mount(<Map onMapInit={onMapInit} />)

    expect(onMapInit).toHaveReturnedTimes(1)
  })
})
