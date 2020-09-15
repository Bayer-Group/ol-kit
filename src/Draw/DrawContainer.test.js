import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { prettyDOM } from '@testing-library/dom'
import { Map } from 'Map'
import DrawContainer from './DrawContainer'

describe('<DrawContainer />', () => {
  it('should render a basic prebuilt DrawContainer component', async () => {
    const { container } = render(<Map><DrawContainer /></Map>)

    // wait for async child render
    await waitFor(() => {}, { container })

    expect(prettyDOM(container)).toMatchSnapshot()
  })
  it.skip('should render a single child', async () => {
    const child = <div id='draw child comp'>draw child comp</div>
    const { container } = render(<Map><DrawContainer>{child}</DrawContainer></Map>)

    // wait for async child render
    await waitFor(() => {}, { container })

    expect(prettyDOM(container)).toMatchSnapshot()
  })
  it.skip('should render an array of children', async () => {
    const child1 = <div key={1} id='draw child comp 1'>child comp 1</div>
    const child2 = <div key={2} id='draw child comp 2'>child comp 2</div>
    const child3 = <div key={3} id='draw child comp 3'>child comp 3</div>
    const { container } = render(<Map><DrawContainer>{[child1, child2, child3]}</DrawContainer></Map>)

    // wait for async child render
    await waitFor(() => {}, { container })

    expect(prettyDOM(container)).toMatchSnapshot()
  })
})
