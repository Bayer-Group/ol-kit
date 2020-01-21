import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() })

// Mock canvas APIs
const canvasPrebuilt = (function () {
  const canvas = require('canvas-prebuilt')

  return canvas
})()

Object.defineProperty(window, 'CanvasPattern', {
  value: canvasPrebuilt
})
Object.defineProperty(window, 'CanvasGradient', {
  value: canvasPrebuilt
})
