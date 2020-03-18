import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import 'jest-styled-components'
import '@babel/polyfill'

// add mock to keep map snapshots consistent
jest.mock('nanoid', () => () => 'test_id')

configure({ adapter: new Adapter() })
