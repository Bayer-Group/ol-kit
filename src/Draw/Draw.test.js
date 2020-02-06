import React from 'react'
import { mount } from 'enzyme'
import Draw from './Draw'

describe('<Draw />', () => {
  it('should render a basic Draw component', () => {
    const wrapper = mount(<Draw />)

    expect(wrapper).toMatchSnapshot()
  })
})
