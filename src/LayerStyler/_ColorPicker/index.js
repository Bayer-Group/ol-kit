import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { BlockPicker } from 'react-color'
import {
  Container,
  ColorPickerPositioner,
  CurrentColor
} from './styled'

const colors = [
  '#f44336',
  '#9c27b0',
  '#673ab7',
  '#3f51b5',
  '#2196f3',
  '#03a9f4',
  '#00bcd4',
  '#009688',
  '#4caf50',
  '#8bc34a',
  '#cddc39',
  '#ffeb3b',
  '#ffc107',
  '#ff9800',
  '#795548',
  '#607d8b',
  '#000000',
  '#ffffff'
]

/**
 * @component
 * @category ColorPicker
 */
class ColorPicker extends Component {
  constructor (props) {
    super(props)

    this.state = {
      colorPickerOpen: false,
      uid: Math.floor((Math.random() * 10000))
    }
  }

  handleColorChange = (opts) => {
    this.props.handleSelect(opts.hex)
  }

  handleOffClick = e => {
    if (this.state.colorPickerOpen) {
      // assume off-click until proven wrong
      let offClick = true

      // loop through elements in clicked path to determine off-click
      e.path.forEach(elem => {
        elem.classList && elem.classList.forEach(className => {
          // uid in className avoids bug where two color pickers can be open at once
          const { uid } = this.state

          // click happened within BlockPicker or CurrentColor so this is not an off-click
          if (className === 'block-picker' || className === `current-color-${uid}`) offClick = false
        })
      })
      // if off-click occured close color picker
      if (offClick) this.setState({ colorPickerOpen: false })
    }
  }

  componentDidMount () {
    document.addEventListener('click', this.handleOffClick)
  }

  componentWillUnmount () {
    document.removeEventListener('click', this.handleOffClick)
  }

  componentDidUpdate (prevProps, prevState) {
    // hacky dom manipulations to force styling on the BlockPicker component
    if (!prevState.colorPickerOpen && this.state.colorPickerOpen) {
      // add border to white swatch
      Array.from(document.querySelectorAll('[title="#ffffff"]')).forEach(elem => {
        elem.style.border = '1px solid #d8d8d8'
      })
      // shrink hex colored header & remove the hex code
      Array.from(document.getElementsByClassName('block-picker')).forEach(elem => {
        const header = elem.children[1]

        header.style.height = '12px'
        header.innerHTML = ''
      })
    }
  }

  render () {
    const { currentColor } = this.props
    const { colorPickerOpen, uid } = this.state

    return (
      <Container>
        <CurrentColor className={`current-color-${uid}`} color={currentColor} onClick={() => this.setState({ colorPickerOpen: !colorPickerOpen })} />
        {colorPickerOpen &&
          <ColorPickerPositioner>
            <BlockPicker color={currentColor} colors={colors} onChangeComplete={this.handleColorChange} />
          </ColorPickerPositioner>
        }
      </Container>
    )
  }
}

ColorPicker.propTypes = {
  /** The currently selected color */
  currentColor: PropTypes.string.isRequired,

  /** Callback function which passes the hex value of the color selected */
  handleSelect: PropTypes.func
}

ColorPicker.defaultProps = {
  currentColor: '#ffffff',
  handleSelect: () => {}
}

export default ColorPicker
