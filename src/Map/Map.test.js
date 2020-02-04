import React from 'react'
import { mount } from 'enzyme'
import olMap from 'ol/map'
import olView from 'ol/view'
import Map from './Map'

describe('<Map />', () => {
  it('should render with a map prop', (done) => {
    const mockMap = new olMap({
      view: new olView({
        center: [],
        zoom: 5
      })
    })

    // still fires callback with the passed map after optional animations
    const onMapInit = jest.fn(map => {
      // returned map should be an openlayers map
      expect(map).toBeInstanceOf(olMap)
      // onMapInit should be called with the passed map prop
      expect(map).toBe(mockMap)
      done()
    })

    mount(<Map map={mockMap} onMapInit={onMapInit} />)
  })

  it('should render with onMapInit callback', (done) => {
    // set the url with a view param
    window.history.replaceState(null, '', `${window.location.pathname}?view=49.618551,-97.280674,8.00,0.91`)
    const onMapInit = map => {
      // returned map should be an openlayers map
      expect(map).toBeInstanceOf(olMap)
      // do not respect the view location from the url since updateViewFromUrl={false}
      expect(map.getView().getCenter()).not.toEqual([-10829235.09370645, 6380475.798452517])
      expect(map.getView().getZoom()).not.toBe(8)
      // round off crazy long decimal
      expect(Number(map.getView().getRotation().toFixed(2))).not.toEqual(0.91)
      done()
    }

    // using updateViewFromUrl={false} checks a separate if block inside Map's componentDidMount
    mount(<Map onMapInit={onMapInit} updateViewFromUrl={false} />)
  })

  it('should read the url and set the map location', (done) => {
    // set the url with a view param
    window.history.replaceState(null, '', `${window.location.pathname}?view=49.618551,-97.280674,8.00,0.91`)
    const onMapInit = map => {
      // updated map center, zoom & rotation from url
      expect(map.getView().getCenter()).toEqual([-10829235.09370645, 6380475.798452517])
      expect(map.getView().getZoom()).toBe(8)
      // round off crazy long decimal
      expect(Number(map.getView().getRotation().toFixed(2))).toEqual(0.91)
      done()
    }

    // updateViewFromUrl should be defaulted to true
    mount(<Map onMapInit={onMapInit} />)
  })
})
