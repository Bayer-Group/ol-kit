import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { prettyDOM } from '@testing-library/dom'
import olFeature from 'ol/feature'
import olVectorLayer from 'ol/layer/vector'
import olPoint from 'ol/geom/point'
import olVectorSource from 'ol/source/vector'
import { Map } from 'Map'
import { Popup } from 'Popup'

describe('<Popup />', () => {
  it('should fire onMapClick for empty map click', async () => {
    let testMap
    const onMapInit = jest.fn(map => {
      testMap = map
    })
    const onMapClick = jest.fn()
    const { getByTestId } = render(<Map onMapInit={onMapInit}><Popup onMapClick={onMapClick} show /></Map>)

    // wait for async child render
    await waitFor(() => expect(onMapInit).toHaveBeenCalled())

    // click the map anywhere (there are no features to trigger the popup)
    testMap.dispatchEvent({ type: 'click', map: testMap, pixel: [20, 20] })

    const hidePopupEvent = {
      clickPixel: [0, 0],
      clickCoordinate: [0, 0],
      features: [],
      loading: false,
      popupPosition: { arrow: 'none', pixel: [0, 0], fits: false },
      show: false
    }

    expect(onMapClick).toHaveBeenCalledWith(hidePopupEvent)

    const defaultInsert = await getByTestId('popup-insert-default')

    expect(defaultInsert).toBeTruthy()
  })

  it.skip('should fire onMapClick for feature clicks on map', async () => {
    // set dimensions for body
    document.body.style.setProperty('width', '600px')
    document.body.style.setProperty('height', '400px')

    let testMap
    const onMapInit = jest.fn(map => {
      testMap = map
    })
    const onMapClick = jest.fn(e => console.log(e))
    const { getByTestId } = render(<Map onMapInit={onMapInit} fullScreen><Popup onMapClick={onMapClick} show /></Map>)

    // wait for async child render
    await waitFor(() => expect(onMapInit).toHaveBeenCalled())

    // set dimensions for map
    testMap.getTargetElement().style.setProperty('width', '600px')
    testMap.getTargetElement().style.setProperty('height', '400px')
    testMap.setSize(600, 400)
    const [minx, miny, maxx, maxy] = testMap.getView().calculateExtent([600, 400]) // eslint-disable-line no-unused-vars

    const coords = [minx, maxy]

    console.log('set', testMap.getTargetElement())
    console.log('pixel', testMap.getCoordinateFromPixel([0, 0]), testMap.getSize(), testMap.getView().getCenter(), testMap.getView().calculateExtent([600, 400]))

    // add a feature to that map at a known pixel location
    const features = [new olFeature(new olPoint([coords]))]

    const source = new olVectorSource({ features })
    const vectorLayer = new olVectorLayer({ source })

    testMap.addLayer(vectorLayer)

    // click the map anywhere (there are no features to trigger the popup)
    testMap.dispatchEvent({ type: 'click', map: testMap, pixel: [0, 0] })

    const hidePopupEvent = {
      features, // should have an array with single feature above
      loading: false,
      popupPosition: { arrow: 'none', pixel: [0, 0], fits: false },
      show: true
    }

    expect(onMapClick).toHaveBeenCalledWith(hidePopupEvent)

    const defaultInsert = await getByTestId('popup-insert-default')

    expect(defaultInsert).toBeTruthy()
  })

  it('should render custom child', async () => {
    const customChild = <div data-testid='popup-insert-custom'>this is a custom popup insert</div>
    const { container, getByTestId } = render(<Map><Popup show>{customChild}</Popup></Map>)

    // wait for async child render
    await waitFor(() => {}, { container })
    const child = await getByTestId('popup-insert-custom')

    expect(prettyDOM(child)).toMatchSnapshot()
  })
})
