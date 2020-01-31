import React from 'react'
import { mount } from 'enzyme'
import olMap from 'ol/map'
import Map from './Map'

describe('<Map />', () => {
  it('should render with a map prop', () => {
    const mockMap = new olMap()
    // still fires callback with the passed map after optional animations
    const onMapInit = jest.fn(map => { expect(map).toBeInstanceOf(olMap) })
    const wrapper = mount(<Map onMapInit={onMapInit} />)

    expect(onMapInit).toHaveReturnedTimes(1)
  })

  it('should render with onMapInit callback', () => {
    const onMapInit = jest.fn(map => { expect(map).toBeInstanceOf(olMap) })
    // using shouldReadUrl={false} checks a separate if block inside Map's componentDidMount
    const wrapper = mount(<Map onMapInit={onMapInit} shouldReadUrl={false} />)

    expect(onMapInit).toHaveReturnedTimes(1)
  })
})
