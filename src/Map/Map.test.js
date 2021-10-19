import React from 'react'
import PropTypes from 'prop-types'
import { mount } from 'enzyme'
import { render, waitFor } from '@testing-library/react'
import { prettyDOM } from '@testing-library/dom'
import olMap from 'ol/Map'
import olView from 'ol/View'
import olInteractionSelect from 'ol/interaction/Select'
import { Map, createMap } from 'Map'
import { connectToContext } from 'Provider'

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

  it('should render with onMapInit callback', async () => {
    // set the url with a view param
    window.history.replaceState(null, '', `${window.location.pathname}?view=49.618551,-97.280674,8.00,0.91`)
    let testMap = null
    const onMapInit = map => {
      // hoist map to closure for later expect
      testMap = map
      // returned map should be an openlayers map
      expect(map).toBeInstanceOf(olMap)
      // do not respect the view location from the url since updateViewFromUrl={false}
      expect(map.getView().getCenter()).not.toEqual([-10829235.09370645, 6380475.798452517])
      expect(map.getView().getZoom()).not.toBe(8)
      // round off crazy long decimal
      expect(Number(map.getView().getRotation().toFixed(2))).not.toEqual(0.91)
    }

    // using updateViewFromUrl={false} checks a separate if block inside Map's componentDidMount
    const { container } = render(<Map onMapInit={onMapInit} updateViewFromUrl={false} />)

    // wait for async child render
    await waitFor(() => {}, { container })

    // make sure a <ol-viewport> element is within the rendered html
    expect(prettyDOM(testMap.getTargetElement())).toEqual(expect.stringContaining('ol-viewport'))
  })

  it.skip('should read the url and set the map location', (done) => {
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

  it('should attach contextProps from onMapInit to context', async (done) => {
    const onMapInit = async map => {
      const contextProps = {
        catchphrase: 'to infinity and beyond'
      }

      // object returned from onMapInit will pass contextProps to all wrapped components
      return { contextProps }
    }

    function Comp (props) {
      return <div>{props.catchphrase}</div>
    }
    // setting propTypes is required for connectToContext to attach props correctly
    Comp.propTypes = {
      catchphrase: PropTypes.string
    }
    const WrappedComp = connectToContext(Comp)
    const { container, getByText } = render(<Map onMapInit={onMapInit}><><WrappedComp /><WrappedComp catchphrase='clever girl' /></></Map>)

    // wait for async child render
    await waitFor(() => {}, { container })

    // wait for rerender from provider addMapToContext call
    setTimeout(() => {
      // this proves contextProps from onMapInit get attached to context
      expect(getByText('to infinity and beyond')).toBeInTheDocument()
      // this proves explicit props always override context props
      expect(getByText('clever girl')).toBeInTheDocument()
      done()
    }, 1000)
  })
})

describe('select interaction', () => {
  it('should add a select interaction to the map by default', async () => {
    let testMap
    const onMapInit = jest.fn(map => {
      testMap = map
    })

    render(<Map onMapInit={onMapInit} />)

    // wait for async map init
    await waitFor(() => expect(onMapInit).toHaveBeenCalled())

    const selectInteractionsOnMap = testMap.getInteractions().getArray().filter(interaction => {
      return interaction instanceof olInteractionSelect
    })

    expect(selectInteractionsOnMap.length).toBe(1)
  })

  it('should not double add a select interaction to the map', async () => {
    document.body.innerHTML = '<div id="map"></div>'
    const testMap = createMap({ target: 'map' })
    const selectInteraction = new olInteractionSelect()

    // add the interaction to the map before it is passed as a prop
    testMap.addInteraction(selectInteraction)

    const { container } = render(<Map map={testMap} selectInteraction={selectInteraction} />)

    // wait for async child render
    await waitFor(() => {}, { container })

    const selectInteractionsOnMap = testMap.getInteractions().getArray().filter(interaction => {
      return interaction instanceof olInteractionSelect
    })

    expect(selectInteractionsOnMap.length).toBe(1)
    // make sure the select insteraction Map uses is the same instance created and passed in
    expect(selectInteractionsOnMap[0]).toBe(selectInteraction)
  })
  it('add the passed selectInteraction to the map for the user', async () => {
    document.body.innerHTML = '<div id="map"></div>'
    const testMap = createMap({ target: 'map' })
    // this time the interaction is just passed but not added to the map beforehand
    const selectInteraction = new olInteractionSelect()

    const { container } = render(<Map map={testMap} selectInteraction={selectInteraction} />)

    // wait for async child render
    await waitFor(() => {}, { container })

    const selectInteractionsOnMap = testMap.getInteractions().getArray().filter(interaction => {
      return interaction instanceof olInteractionSelect
    })

    expect(selectInteractionsOnMap.length).toBe(1)
    // make sure the select insteraction Map uses is the same instance created and passed in
    expect(selectInteractionsOnMap[0]).toBe(selectInteraction)
  })
})
