import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { prettyDOM } from '@testing-library/dom'
import { Map } from 'Map'
import DrawContainer from './DrawContainer'

describe('<BasemapManager />', () => {
  it('should render a basic prebuilt DrawContainer component', async () => {
    const { container } = render(<Map><DrawContainer /></Map>)

    // wait for async child render
    await waitFor(() => {}, { container })

    expect(prettyDOM(container)).toMatchSnapshot()
  })
  it('should render a single child', async () => {
    const child = <div id='child comp'>child comp</div>
    const { container } = render(<Map><DrawContainer>{child}</DrawContainer></Map>)

    // wait for async child render
    await waitFor(() => {}, { container })

    expect(prettyDOM(container)).toMatchSnapshot()
  })
  it('should render an array of children', async () => {
    const child1 = <div key={1} id='1'>child comp</div>
    const child2 = <div key={2} id='2'>child comp</div>
    const child3 = <div key={3} id='3'>child comp</div>
    const { container } = render(<Map><DrawContainer>{[child1, child2, child3]}</DrawContainer></Map>)

    // wait for async child render
    await waitFor(() => {}, { container })

    expect(prettyDOM(container)).toMatchSnapshot()
  })
})
