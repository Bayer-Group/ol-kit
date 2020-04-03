import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { prettyDOM } from '@testing-library/dom'
import Map from '../Map'
import BasemapManager from './BasemapManager'

describe('<BasemapManager />', () => {
  it.skip('should render a basic basemap manager component', async () => {
    const { container } = render(<Map><BasemapManager inlineProp={true} /></Map>)

    // wait for async child render
    await waitFor(() => {}, { container })

    expect(prettyDOM(container)).toMatchSnapshot()
  })
  it.skip('should render a single child', async () => {
    const child = <div id='child comp'>child comp</div>
    const { container } = render(<Map><BasemapManager>{child}</BasemapManager></Map>)

    // wait for async child render
    await waitFor(() => {}, { container })

    expect(prettyDOM(container)).toMatchSnapshot()
  })
  it.skip('should render an array of children', async () => {
    const child1 = <div key={1} id='1'>child comp</div>
    const child2 = <div key={2} id='2'>child comp</div>
    const child3 = <div key={3} id='3'>child comp</div>
    const { container } = render(<Map><BasemapManager>{[child1, child2, child3]}</BasemapManager></Map>)

    // wait for async child render
    await waitFor(() => {}, { container })

    expect(prettyDOM(container)).toMatchSnapshot()
  })
})
