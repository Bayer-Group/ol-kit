import React from 'react'
import { mount } from 'enzyme'
import olMap from 'ol/map'
import Controls from './Controls'

describe('<Controls />', () => {
  it('should mount', () => {
    document.body.innerHTML = `<div id='map'></div>`
    const mockMap = new olMap({ target: 'map' })
    const wrapper = mount(<Controls map={mockMap} />)

    console.log(wrapper)
  })
})
