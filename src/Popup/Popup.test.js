import React from 'react'
import { mount } from 'enzyme'
import { render, waitFor } from '@testing-library/react'
import { prettyDOM } from '@testing-library/dom'
import Map, { createMap } from 'Map'
import Popup from './Popup'

describe('<Popup />', () => {
  it('should render default insert', async () => {
    console.log('bpdy', document.body.innerHTML = '<div id="map"></div>')
    const map = createMap({ target: 'map' })
    const { container } = render(<Popup map={map} />)

    // wait for async child render
    await waitFor(() => {}, { container })

    expect(prettyDOM(container)).toMatchSnapshot()
  })
})
