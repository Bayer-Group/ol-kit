import React from 'react'
import { mount } from 'enzyme'
import olMap from 'ol/map'
import Map from './Map'
import { connectToMap, createMap } from './utils'

describe('Map utils', () => {
  it('should return a map', () => {
    const map = createMap({ target: 'test-id' })

    expect(typeof map).toEqual('object')
    // expect(map instanceof olMap).toBe(true)
  })
})

describe('connectToMap', () => {
  it('should render without passing a map', () => {
    // Map has not been mounted; no MapContext, so just render the Child
    const Consumer = connectToMap(props => <div>child comp</div>)
    const wrapper = mount(<Consumer inlineProp={true} />)

    // make sure connectToMap is passing inline props down to children
    expect(wrapper.props().inlineProp).toBe(true)
    // connectToMap should NOT add a map prop since Map is NOT mounted
    expect(wrapper.props().map).toBeFalsy()
  })

  it('should pass a map prop to children', () => {
    const Child = props => <div>child comp</div>
    const Consumer = connectToMap(Child)
    const wrapper = mount(<Consumer inlineProp={true} />, { wrappingComponent: Map })

    expect(wrapper.find(Consumer).props().inlineProp).toBe(true)
    // make sure connectToMap is passing inline props down to children
    expect(wrapper.find(Child).props().inlineProp).toBe(true)
    // connectToMap should add a map prop since Map is mounted
    expect(wrapper.find(Child).props().map).toBeTruthy()
  })
})
