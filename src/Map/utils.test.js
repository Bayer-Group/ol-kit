import React from 'react'
import olMap from 'ol/map'
import * as utils from './utils'

describe('Map utils', () => {
  it('should return a map', () => {
    const map = utils.createMap({ target: 'test-id' })

    expect(typeof map).toEqual('object')
    // expect(map instanceof olMap).toBe(true)
  })
})
