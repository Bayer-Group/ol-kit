import React, { Component } from 'react'
import PropTypes from 'prop-types'
import uuid from 'uuid'
import { Container, Header, SubHeader, TextInput, Bar, Highlight, Group } from './styled'

class Selector extends Component {
  constructor (props) {
    super(props)

    const options = this.formatOptions(props.options)

    this.state = {
      options,
      value: props.selected
    }

    this.inputId = uuid.v4()
  }

  formatOptions = (options = []) => {
    // turn array of strings into array of options objects that react-select can read
    return options.map(option => ({
      value: option,
      label: option
    }))
  }

  clickHandler = () => this.forceUpdate() // Force an update to figure out if the component is still focused or not.

  getInputId = () => `${this.inputId}_input` // calculates the input id

  getActiveElementId = () => document.activeElement ? document.activeElement.id : null

  hasFocus = () => this.getActiveElementId() === this.getInputId() // Select.onFocus alone is not sufficient to determine if the component has focus or not so we determine this by querying the document for the active element and comparing it to our component's input id. This could be stored in state but it's not really the state of the component itself but a DOM comparison.

  handleChange = (event, { action }) => {
    const { onValueChange } = this.props
    const { value } = event || { value: '' }

    switch (action) {
      case 'select-option':
        // fall through
      case 'set-value':
        // called when menu item clicked
        this.setState({ value }, onValueChange(value))
        break
      case 'clear':
        // when user clicks x button
        this.setState({ value: '' }, onValueChange(''))
        break
      case 'input-change':
        // when user typed a value
        this.setState({ value: '' }, onValueChange(event))
        break
      default:
        // Do nothing
    }
  }

  isMenuOpen = () => {
    const { value, options = [] } = this.state
    const hasFocus = this.hasFocus()
    const noValueSelected = !options.some(thing => thing.value === value)

    return hasFocus && options.length && noValueSelected
  }

  componentDidMount () {
    document.addEventListener('click', this.clickHandler)
  }

  componentWillUnmount () {
    document.removeEventListener('click', this.clickHandler)
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps (nextProps) {
    const options = this.formatOptions(nextProps.options)

    if (options && options !== this.state.options) this.setState({ options })

    // check for selection passed as a prop
    if (nextProps.selected !== '' && nextProps.selected !== this.state.value) this.setState({ value: nextProps.selected })
  }

  render () {
    const { header, subHeader, disabled, selected, isLoading, styles } = this.props
    const { value, options = [] } = this.state
    const hasFocus = this.hasFocus()
    const isValid = value !== ''
    const defaultValueProp = {}

    if (options.length) {
      defaultValueProp.defaultValue = { value: selected, label: selected }
    } else {
      defaultValueProp.defaultInputValue = selected
    }

    const customStyles = {
      container: (provided, state) => ({ ...provided, fontSize: state.selectProps.isLoading ? '6px !important' : null }),
      loadingIndicator: provided => ({ ...provided, marginRight: '10px' })
    }

    return (
      <Container style={styles} {...this.props}>
        <Group>
          <TextInput
            autoFocus={false /* autoFocus would open the menu on mount which blocks some of the ui */}
            placeholder={'' /* 'header' serves as the placeholder so we don't want one in the text input */}
            {...defaultValueProp}
            inputId={this.getInputId()}
            options={options}
            isSearchable={true}
            isClearable={options.length}
            isLoading={isLoading}
            onChange={this.handleChange}
            onClick={this.props.onClick}
            isDisabled={disabled}
            menuPlacement='top'
            styles={customStyles} />
          <Bar focus={hasFocus} />
          <Highlight focus={hasFocus} />
          {header && <Header
            focus={hasFocus}
            valid={isValid}
            disabled={disabled}
            htmlFor={this.getInputId()}>{header}</Header>}
          {subHeader && <SubHeader focus={hasFocus}>{subHeader}</SubHeader>}
        </Group>
      </Container>
    )
  }
}

Selector.defaultProps = {
  onValueChange: () => {},
  onIndexChange: () => {},
  options: [],
  selected: '',
  autocomplete: 'off',
  disabled: false,
  isLoading: false
}

Selector.propTypes = {
  options: PropTypes.array.isRequired,
  onValueChange: PropTypes.func,
  onIndexChange: PropTypes.func,
  header: PropTypes.string,
  selected: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  subHeader: PropTypes.string,
  autocomplete: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,

  /** Show loading indicator on select input */
  isLoading: PropTypes.bool,
  styles: PropTypes.object
}

export default Selector
