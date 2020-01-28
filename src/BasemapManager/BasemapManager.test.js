import React from 'react'
import { mount } from 'enzyme'
import BasemapManager from './BasemapManager'
import 'jest-styled-components'
import Map from '../Map'

describe('<Map />', () => {
  it('should render a basic basemap manager component', () => {
    const wrapper = mount(<BasemapManager inlineProp={true} />, { wrappingComponent: Map })

    expect(wrapper).toMatchSnapshot()
  })
  it('should render a single child', () => {
    const child = <div id='child comp'>child comp</div>
    const wrapper = mount(<BasemapManager children={child} />, { wrappingComponent: Map })

    expect(wrapper).toMatchSnapshot()
  })
  it('should render an array ofd children', () => {
    const child1 = <div id='1'>child comp</div>
    const child2 = <div id='2'>child comp</div>
    const child3 = <div id='3'>child comp</div>
    const wrapper = mount(<BasemapManager children={[child1, child2, child3]} />, { wrappingComponent: Map })

    expect(wrapper).toMatchSnapshot()
  })
})
