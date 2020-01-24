import React from 'react'
import { mount, shallow } from 'enzyme'
import olMap from 'ol/map'
import Controls from './Controls'

document.body.innerHTML = `<div id='map'></div>`
const mockMap = new olMap({
  controls: [],
  target: 'map'
})

describe('<Controls />', () => {
  it('should shallow controls default position', () => {
    const wrapper = shallow(<Controls map={mockMap} />)

    expect(wrapper).toMatchSnapshot()
  })
  it('should shallow controls in top left', () => {
    const wrapper = shallow(<Controls map={mockMap} position='top-left' />)

    expect(wrapper).toMatchSnapshot()
  })
  it('should shallow controls in top right', () => {
    const wrapper = shallow(<Controls map={mockMap} position='top-right' />)

    expect(wrapper).toMatchSnapshot()
  })
  it('should shallow controls in bottom left', () => {
    const wrapper = shallow(<Controls map={mockMap} position='bottom-left' />)

    expect(wrapper).toMatchSnapshot()
  })
})

describe('Compass interactions', () => {
  it('should rotate map counter-clockwise', () => {
    const wrapper = mount(<Controls map={mockMap} />)
    const initialRotation = mockMap.getView().getRotation()

    expect(initialRotation).toBe(0)
    // click rotate map left arrow
    wrapper.find('#_ol_kit_rotate_left').simulate('click')
    expect(mockMap.getView().getRotation()).toBe(-0.39269908169872414)
  })
  it('should rotate map to true north', () => {
    const wrapper = mount(<Controls map={mockMap} />)
    const initialRotation = mockMap.getView().getRotation()

    expect(initialRotation).not.toBe(0)
    // click true north arrow
    wrapper.find('#_ol_kit_true_north').simulate('click')
    expect(mockMap.getView().getRotation()).toBe(0)
  })
  it('should rotate map clockwise', () => {
    const wrapper = mount(<Controls map={mockMap} />)
    const initialRotation = mockMap.getView().getRotation()

    expect(initialRotation).toBe(0)
    // click rotate map right arrow
    wrapper.find('#_ol_kit_rotate_right').simulate('click')
    expect(mockMap.getView().getRotation()).toBe(0.39269908169872414)
  })
})

describe('Zoom control interactions', () => {
  // zoom is undefined if we don't set it programmatically
  mockMap.getView().setZoom(5)

  it('should zoom map in', () => {
    const wrapper = mount(<Controls map={mockMap} />)
    const initialZoom = mockMap.getView().getZoom()

    expect(initialZoom).toBe(5)
    // click + zoom in button
    wrapper.find('#_ol_kit_zoom_in').first().simulate('click')
    expect(mockMap.getView().getZoom()).toBe(5.1)
  })
  it('should zoom map out', () => {
    const wrapper = mount(<Controls map={mockMap} />)
    const initialZoom = mockMap.getView().getZoom()

    expect(initialZoom).not.toBe(5)
    // click - zoom out button
    wrapper.find('#_ol_kit_zoom_out').first().simulate('click')
    expect(mockMap.getView().getZoom()).toBe(5)
    // click - zoom out button
    wrapper.find('#_ol_kit_zoom_out').first().simulate('click')
    expect(mockMap.getView().getZoom()).toBe(4.9)
  })
})
