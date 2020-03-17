import * as ol_kit from './index' // eslint-disable-line camelcase
import Map from 'Map'

// utility used by many tests for wrapping a Map component
export const mountOpts = props => ({
  wrappingComponent: Map,
  wrappingComponentProps: {
    allowAsyncMount: false, // this forces wrappingComponent to render children immediately
    ...props
  }
})

describe('ol-kit package', () => {
  it('should not export undefined', () => {
    Object.keys(ol_kit).forEach(exportKey => {
      expect(ol_kit[exportKey]).not.toBeUndefined()
    })

    expect(ol_kit).toMatchSnapshot()
  })
})
