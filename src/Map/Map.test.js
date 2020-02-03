import React from 'react'
import { mount } from 'enzyme'
import olMap from 'ol/map'
import olView from 'ol/view'
import Map from './Map'

describe('<Map />', () => {
  it('should render with a map prop', () => {
    const mockMap = new olMap({
      view: new olView({
        center: [],
        zoom: 5
      })
    })

    // still fires callback with the passed map after optional animations
    const onMapInit = jest.fn(map => { expect(map).toBeInstanceOf(olMap) })

    mount(<Map map={mockMap} onMapInit={onMapInit} shouldReadUrl={false} />)

    expect(onMapInit).toHaveReturnedTimes(1)
  })

  it('should render with onMapInit callback', () => {
    const onMapInit = jest.fn(map => { expect(map).toBeInstanceOf(olMap) })

    // using shouldReadUrl={false} checks a separate if block inside Map's componentDidMount
    mount(<Map onMapInit={onMapInit} shouldReadUrl={false} />)

    expect(onMapInit).toHaveReturnedTimes(1)
  })
})
