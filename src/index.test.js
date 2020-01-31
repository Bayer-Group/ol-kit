import * as ol_kit from './index'

describe('ol-kit package', () => {
  it('should not export undefined', () => {
    Object.keys(ol_kit).forEach(exportKey => {
      expect(ol_kit[exportKey]).not.toBeUndefined()
    })

    expect(ol_kit).toMatchSnapshot()
  })
})
