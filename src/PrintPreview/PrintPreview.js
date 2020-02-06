import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { Preview } from './styled'
import { onmessage } from './worker'
import ugh from '../ugh'

export default class PrintPreview extends Component {
  constructor (props) {
    super(props)

    this.state = {
      worker: null,
      printPreviewWidth: 0,
      printPreviewHeight: 0
    }
  }

  componentDidMount () {
    // Create a Worker from a function
    const scaleFactorWorkerString = `self.onmessage = ${onmessage.toString()}` // convert the worker function to a string
    const workerBlob = new Blob([scaleFactorWorkerString], { type: 'application/javascript' }) // convert the string to a blob
    const workerUrl = URL.createObjectURL(workerBlob) // create a data url from the blob
    const worker = new Worker(workerUrl) // create a worker from the data url

    worker.onerror = (error) => { // throw an error if the worker throws an error
      worker.terminate()

      ugh.throw(error)
    }

    worker.onmessage = (msg) => { // handle the worker messaging the main thread
      const { scaledWidth, scaledHeight, center } = msg.data

      this.setState({ printPreviewWidth: scaledWidth, printPreviewHeight: scaledHeight, center })
    }

    window.addEventListener('resize', this.handleResize) // we want to recalculate the dimensions and location of the preview element if the window is resized

    this.setState({ worker }, this.handleResize)
  }

  componentWillUnmount () {
    this.terminate()
  }

  componentDidUpdate (prevProps) {
    if (prevProps.width !== this.props.width || prevProps.height !== this.props.height) this.handleResize()
  }

  handleResize = () => {
    const { width, height, xOffset, yOffset, padding } = this.props
    const { worker } = this.state
    const { innerWidth, innerHeight } = window

    const message = {
      innerHeight,
      innerWidth,
      width,
      height,
      xOffset,
      yOffset,
      padding
    }

    if (worker) worker.postMessage(message)
  }

  terminate = (e) => {
    const { worker } = this.state

    window.removeEventListener('resize', this.handleResize)

    if (worker) worker.terminate()
  }

  render () {
    const { printPreviewWidth, printPreviewHeight, center } = this.state
    const { children, id, innerRef } = this.props

    return ReactDOM.createPortal(
      <Preview
        id={id}
        width={printPreviewWidth}
        height={printPreviewHeight}
        center={center}
        innerRef={innerRef}>
        {children}
      </Preview>,
      document.body
    )
  }
}

PrintPreview.propTypes = {
  /** The preview element's id */
  id: PropTypes.string,
  /** The desired width in pixels */
  width: PropTypes.number.isRequired,
  /** The desired height in pixels */
  height: PropTypes.number.isRequired,
  /** The X axis offset in pixels */
  xOffset: PropTypes.number,
  /** The Y axis offset in pixels */
  yOffset: PropTypes.number,
  /** The child components */
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  /** A ref that can be used to access the node */
  innerRef: PropTypes.func,
  /** The padding in pixels.  The distance from the edge of the window. */
  padding: PropTypes.number
}

PrintPreview.defaultProps = {
  id: 'pdf-preview',
  xOffset: 0,
  yOffset: 0,
  padding: 6
}
