import React from 'react'
import { mount } from 'enzyme'
import olMap from 'ol/map'
import Map from './Map'
import { connectToMap, createMap } from './utils'

describe('createMap', () => {
  // jest does not reset the DOM after each test, so we do this manually
  afterEach(() => {
    document.getElementsByTagName('html')[0].innerHTML = '';
  })

  it('createMap should return a map when given a DOM id', () => {
    const map = createMap({ target: 'test-id' })

    expect(typeof map).toEqual('object')
    expect(map.constructor.name).toBe('_ol_Map_')
  })

  it('createMap should return a map when given a DOM element', () => {
    global.document.body.innerHTML = '<div id="map"></div>'
    const el = global.document.getElementById('map')

    const map = createMap({ target: el })

    expect(typeof map).toEqual('object')
    expect(map.constructor.name).toBe('_ol_Map_')
  })

  it('createMap called without arguments throws an error', () => {
    const testCreate = () => createMap()

    expect(testCreate).toThrowError(new Error('You must pass an options object with a DOM target for the map'));
  })

  it('createMap called with incorrect arguments throws an error', () => {
    const testCreate = () => createMap({ target: true })

    expect(testCreate).toThrowError(new Error('The target should either by a string id of an existing DOM element or the element itself'))
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
    expect(wrapper.props().map).toBeUndefined()
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
