import React from 'react'
import { mount } from 'enzyme'
import qs from 'qs'
import olMap from 'ol/map'
import Map from './Map'
import { connectToMap, createMap, updateMapFromUrl, updateUrlFromMap } from './utils'

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

describe('updateMapFromUrl', () => {
  // jest does not reset the DOM after each test, so we do this manually
  afterEach(() => {
    document.getElementsByTagName('html')[0].innerHTML = '';
  })

  it('should throw error for missing map arg', () => {
    expect(updateMapFromUrl()).rejects.toMatchSnapshot()
  })

  it('should return rejected promise for missing view url param', () => {
    global.document.body.innerHTML = '<div id="map"></div>'

    const el = global.document.getElementById('map')
    const map = createMap({ target: el })

    expect(updateMapFromUrl(map)).rejects.toMatchSnapshot()
  })

  it('should update map from url with default "view" url param', () => {
    global.document.body.innerHTML = '<div id="map"></div>'

    const el = global.document.getElementById('map')
    const map = createMap({ target: el })

    // set initial center, zoom & rotation
    map.getView().setCenter([0,0])
    map.getView().setZoom(3)
    map.getView().setRotation(0)

    expect(map.getView().getCenter()).toEqual([0,0])
    expect(map.getView().getZoom()).toBe(3)
    expect(map.getView().getRotation()).toBe(0)

    // set the url with a view param
    window.history.replaceState(null, '', `${window.location.pathname}?view=49.618551,-97.280674,8.00,0.91`)

    // second arg (viewParam) is defaulted to "view"
    updateMapFromUrl(map)
    // updated map center, zoom & rotation from url
    expect(map.getView().getCenter()).toEqual([ -10829235.09370645, 6380475.798452517 ])
    expect(map.getView().getZoom()).toBe(8)
    // round off crazy long decimal
    expect(Number(map.getView().getRotation().toFixed(2))).toEqual(0.91)
  })

  it('should update map from url with custom "customParam" url param', () => {
    global.document.body.innerHTML = '<div id="map"></div>'

    const el = global.document.getElementById('map')
    const map = createMap({ target: el })

    // set initial center, zoom & rotation
    map.getView().setCenter([0,0])
    map.getView().setZoom(3)
    map.getView().setRotation(0)

    expect(map.getView().getCenter()).toEqual([0,0])
    expect(map.getView().getZoom()).toBe(3)
    expect(map.getView().getRotation()).toBe(0)

    // set the url with a view param
    window.history.replaceState(null, '', `${window.location.pathname}?customParam=49.618551,-97.280674,8.00,0.91`)

    // second arg (viewParam) is "customParam"
    updateMapFromUrl(map, 'customParam')
    // updated map center, zoom & rotation from url
    expect(map.getView().getCenter()).toEqual([ -10829235.09370645, 6380475.798452517 ])
    expect(map.getView().getZoom()).toBe(8)
    // round off crazy long decimal
    expect(Number(map.getView().getRotation().toFixed(2))).toEqual(0.91)
  })
})

describe('updateUrlFromMap', () => {
  // jest does not reset the DOM after each test, so we do this manually
  afterEach(() => {
    document.getElementsByTagName('html')[0].innerHTML = '';
  })

  it('should update url from map changes', () => {
    global.document.body.innerHTML = '<div id="map"></div>'
    // set the url with a competing url param
    window.history.replaceState(null, '', `${window.location.pathname}?existingParam=true&otherParam=false`)

    const el = global.document.getElementById('map')
    const onMapInit = map => {
      const query = qs.parse(window.location.search, { ignoreQueryPrefix: true })
      // existingParam is set above when the url is reset^ (make sure it still exists)
      expect(query.existingParam).toBe('true')
      // check to make sure the param otherParam set to the url hasn't been overwritten
      expect(query.otherParam).toBe('false')
      // check to make sure the view param was added to the url
      expect(query.view).toBe('39.000000,-96.000000,5.00,0.00')
    }
    // default updateUrlFromMap is true
    // shouldReadUrl is set to false here since jest can't hit the .finally block
    // in Map's componentDidMount
    const wrapper = mount(<Map onMapInit={onMapInit} shouldReadUrl={false} />)
  })
})
