import React from 'react'
import { mount } from 'enzyme'
import Map from '../Map'
import MapConsumer from './MapConsumer'

describe('<MapConsumer />', () => {
  it('should render without passing a map', () => {
    // Map has not been mounted; no MapContext, so just render the Child
    const Consumer = MapConsumer(props => <div>child comp</div>)
    const wrapper = mount(<Consumer inlineProp={true} />)

    // make sure MapConsumer is passing inline props down to children
    expect(wrapper.props().inlineProp).toBe(true)
    // MapConsumer should NOT add a map prop since Map is NOT mounted
    expect(wrapper.props().map).toBeFalsy()
  })

  it('should pass a map prop to children', () => {
    const Child = props => <div>child comp</div>
    const Consumer = MapConsumer(Child)
    const wrapper = mount(<Consumer inlineProp={true} />, { wrappingComponent: Map })

    expect(wrapper.find(Consumer).props().inlineProp).toBe(true)
    // make sure MapConsumer is passing inline props down to children
    expect(wrapper.find(Child).props().inlineProp).toBe(true)
    // MapConsumer should add a map prop since Map is mounted
    expect(wrapper.find(Child).props().map).toBeTruthy()
  })
})
