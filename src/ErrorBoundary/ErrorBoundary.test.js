import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { Map } from 'Map'
import { MultiMapManager, FlexMap, FullScreenFlex } from 'MultiMapManager'

const Bomb = () => {
  throw new Error('Blew up during render')
}

describe('ErrorBoundary', () => {
  it('displays mappy on Map render errors', async () => {
    const { container, getByText } = render(<Map><Bomb /></Map>)

    // wait for async child render
    await waitFor(() => {}, { container })

    expect(getByText('Something went wrong!')).toBeInTheDocument()
  })

  it.skip('displays mappy on MultiMap render errors', async () => {
    const mapKeys = [
      'map0',
      'map1',
      'map2',
      'map3'
    ]

    const { container, getByText } = render(
      <MultiMapManager groups={[['map0', 'map1'], ['map2', 'map3']]}>
        <FullScreenFlex>
          {mapKeys.map((key, i, array) => {
            return (
              <FlexMap
                key={key}
                index={i}
                total={array.length}
                numberOfRows={2}
                numberOfColumns={2}>
                <Map id={key} isMultiMap>
                  { i % 2 === 0 && <Bomb />}
                </Map>
              </FlexMap>
            )
          })}
        </FullScreenFlex>
      </MultiMapManager>
    )

    // wait for async child render
    await waitFor(() => {}, { container })

    expect(getByText('Something went wrong!')).toBeInTheDocument()
  })
})
