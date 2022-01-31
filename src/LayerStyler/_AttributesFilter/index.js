import React from 'react'
import PropTypes from 'prop-types'
import { nanoid } from 'nanoid'

import CloseIcon from '@material-ui/icons/Close'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'

import { connectToContext } from 'Provider'
import Popover from 'LayerStyler/_Popover'
import Selector from 'LayerStyler/_Selector'
import { ContentContainer, InputContainer, Row, TextContainer, Title } from './styled'

const defaultFilter = {
  logical: 'AND', // determines how to join the filter to other filters
  condition: 'is', // default to 'is' for now
  attribute: '',
  value: ''
}

class AttributesFilter extends React.Component {
  addFilter = () => {
    this.props.onUpdateFilters([...this.props.filters, defaultFilter])
  }

  removeFilter = idx => {
    const newFilters = this.props.filters.filter((f, i) => {
      return i !== idx
    })

    this.props.onUpdateFilters(newFilters)
  }

  // current implementation always updates the logical op for every filter
  updateLogicalOperator (op) {
    const updatedFilters = [...this.props.filters].map(f => ({ ...f, logical: op }))

    this.props.onUpdateFilters(updatedFilters)
  }

  handleSelect = (item, input, idx) => {
    const updateFilter = { ...this.props.filters[idx] }

    if (input === 'attribute') {
      this.props.getValuesForAttribute(item) // parse values based on attribute string -- async
      updateFilter.attribute = item
      updateFilter.value = '' // reset value to empty string since values are calculated per selected attribute
    } else if (input === 'condition') {
      updateFilter.condition = item
    } else if (input === 'value') {
      updateFilter.value = item
    }
    const newFilters = this.props.filters.map((f, i) => {
      return i === idx ? updateFilter : f
    })

    this.props.onUpdateFilters(newFilters)
  }

  render () {
    const { translations, attributes, attributeValues, disabled, filters, filterConditions } = this.props

    const getLogicOperator = (i, filters) => {
      if (i === 0) return translations['_ol_kit.AttributesFilter.where']
      if (i > 1) return filters[0].logical

      return (
        <Select
          value={filters[0].logical}
          onChange={e => this.updateLogicalOperator(e.target.value)}>
          <MenuItem key='AND' value='AND'>{translations['_ol_kit.AttributesFilter.AND']}</MenuItem>
          <MenuItem key='OR'value='OR'>{translations['_ol_kit.AttributesFilter.OR']}</MenuItem>
        </Select>
      )
    }

    return (
      <Popover title={translations['_ol_kit.AttributesFilter.filters'] + (filters.length ? ` (${filters.length})` : '')} disabled={disabled}>
        <ContentContainer>
          <Title>{translations['_ol_kit.AttributesFilter.filters']}</Title>
          {filters.map((filter, i) => {
            return (
              <Row key={nanoid(6)}>
                <CloseIcon onClick={this.removeFilter.bind(this, i)} />
                <TextContainer>
                  {getLogicOperator(i, filters)}
                </TextContainer>
                <InputContainer>
                  <Selector
                    options={attributes}
                    header={`${translations['_ol_kit.AttributesFilter.attribute']} ${i + 1}`}
                    onValueChange={value => this.handleSelect(value, 'attribute', i)}
                    selected={filter.attribute} />
                </InputContainer>
                <InputContainer>
                  <Selector
                    options={filterConditions}
                    header={`${translations['_ol_kit.AttributesFilter.condition']} ${i + 1}`}
                    onValueChange={value => this.handleSelect(value, 'condition', i)}
                    selected={filter.condition} />
                </InputContainer>
                <InputContainer>
                  <Selector
                    options={attributeValues.map(v => `${v}`) /* string interpolation here ensures booleans display properly */}
                    header={`${translations['_ol_kit.AttributesFilter.value']} ${i + 1}`}
                    onValueChange={value => this.handleSelect(value, 'value', i)}
                    selected={filter.value}
                    disabled={!filter.attribute} />
                </InputContainer>
              </Row>
            )
          })}
          <Row><span onClick={this.addFilter}>+ {translations['_ol_kit.AttributesFilter.addFilter']}</span></Row>
        </ContentContainer>
      </Popover>
    )
  }
}

AttributesFilter.propTypes = {
  /** Object with key/value pairs for translated strings */
  translations: PropTypes.object,

  /** Array of attribute strings */
  attributes: PropTypes.array.isRequired,

  /** Disable click on filters button */
  disabled: PropTypes.bool,

  /** Array of filter objects that contain `attribute`: string, `condition`: string, `value`: string, `values`: array */
  filters: PropTypes.array.isRequired,

  /** Optionally override the default filter conditions */
  filterConditions: PropTypes.array,

  /** Callback fired when attribute is selected (can be async) */
  getValuesForAttribute: PropTypes.func.isRequired,

  /** Array of strings representing values for the selected attribute */
  attributeValues: PropTypes.array,

  /** Callback func triggered on filter update with the new filters array */
  onUpdateFilters: PropTypes.func.isRequired
}

AttributesFilter.defaultProps = {
  attributes: [],
  attributeValues: [],
  disabled: false,
  filters: [],
  filterConditions: ['is', 'is not', 'contains'],
  getValuesForAttribute: () => {},
  onUpdateFilters: () => {}
}

export default connectToContext(AttributesFilter)
