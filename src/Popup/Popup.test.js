import React from 'react'
import { render, waitFor } from '@testing-library/react'
import Map from 'Map'
import Popup from './Popup'
import 'jest-styled-components'

describe('<Popup />', () => {
  it('should render default insert', async () => {
    const { container } = render(<Map><Popup /></Map>)

    // wait for async child render
    await waitFor(() => {}, { container })

    expect(container.firstChild).toMatchSnapshot()
  })
})
