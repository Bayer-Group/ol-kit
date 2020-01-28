import * as olKit from './index'

describe('olKit package', () => {
  it('should not export undefined', () => {
    Object.keys(olKit).forEach(exportKey => {
      expect(Boolean(olKit[exportKey])).toBe(true)
    })
  })
})
