import React from 'react'
import { shallow } from 'enzyme'
import BasemapManager from './BasemapManager'
import Map from '../Map'

describe('<BasemapManager />', () => {
  it('should render a basic basemap manager component', () => {
    const wrapper = shallow(<BasemapManager inlineProp={true} />, { wrappingComponent: Map })

    expect(wrapper).toMatchSnapshot()
  })
  it('should render a single child', () => {
    const child = <div id='child comp'>child comp</div>
    const wrapper = shallow(<BasemapManager>{child}</BasemapManager>, { wrappingComponent: Map })

    expect(wrapper).toMatchSnapshot()
  })
  it('should render an array of children', () => {
    const child1 = <div key={1} id='1'>child comp</div>
    const child2 = <div key={2} id='2'>child comp</div>
    const child3 = <div key={3} id='3'>child comp</div>
    const wrapper = shallow(<BasemapManager>{[child1, child2, child3]}</BasemapManager>, { wrappingComponent: Map })

    expect(wrapper).toMatchSnapshot()
  })
})
