import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import 'jest-styled-components'
import '@babel/polyfill'
import '@testing-library/jest-dom/extend-expect'
require('jest-fetch-mock').enableMocks()

// avoid `URL.createObjectURL is not a function` error
global.URL.createObjectURL = jest.fn()

// add mock to keep map snapshots consistent
jest.mock('nanoid', () => {
  return { nanoid: () => 'test_id' }
})

configure({ adapter: new Adapter() })

// this fixes 'TypeError: Illegal invocation' from smooth-dnd
Object.defineProperty(global, 'Node', {
  value: { firstElementChild: 'firstElementChild' }
})
