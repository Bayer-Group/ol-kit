import React from 'react'
import { render, waitFor } from '@testing-library/react'
import Map from 'Map'
import Popup from './Popup'

describe('<Popup />', () => {
  it('should render default insert', async () => {
    const { container } = render(<Popup />, { wrapper: Map })

    // wait for async child render
    await waitFor(() => {}, { container })

    expect(!!container).toEqual(true)
  })

  // it('should render custom child', async () => {
  //   const { container } = render(<Map><Popup /></Map>)
  //
  //   // wait for async child render
  //   await waitFor(() => {}, { container })
  //
  //   expect()
  // })
})
