import * as olKit from './index'

describe('ol-kit package', () => {
  it('should not export undefined', () => {
    Object.keys(olKit).forEach(exportKey => {
      expect(Boolean(olKit[exportKey])).not.toBeUndefined()
    })
  })
})
