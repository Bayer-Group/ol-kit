import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'

import Selector from 'LayerStyler/_Selector'
import GenericSymbolizer from './_GenericSymbolizer'
import escapeRegExp from 'lodash.escaperegexp'

import {
  AddNewContainer,
  AddNew,
  Card,
  AttributeContainer,
  StyleContainer,
  Half,
  DeleteGroup,
  DeleteGroupText
} from './styled'

class StyleGroup extends Component {
  componentDidMount () {
    const { styles } = this.props

    styles.map(style => {
      if (style.name === 'New Auto Style') {
        const attributeValue = style.filter[1][1] instanceof Array
          ? style.filter[1][1][1][1]
          : style.filter[1][1]

        this.props.getValuesForAttribute(attributeValue)
      }
    })
  }

  onSymbolizerChange = (symbolizers, index) => {
    const { styles, onStylesChange } = this.props
    const newStyles = styles.map((style, i) => {
      return i === index ? { ...style, symbolizers } : style
    })

    onStylesChange(newStyles)
  }

  onSymbolizerDelete = (idx) => {
    const { styles, onStylesChange } = this.props
    const newStyles = styles.filter((s, i) => i !== idx)

    onStylesChange(newStyles)
  }

  onDeleteStyleGroup = () => {
    const { onStylesChange } = this.props

    onStylesChange([])
  }

  onNewStyleValue = () => {
    const { styles, onStylesChange } = this.props

    try {
      // we do this stringify/parse here to perform a quick & dirty deep clone
      const styleClone = JSON.parse(JSON.stringify(styles[0]))

      if (styleClone.filter[1][1] instanceof Array) {
        styleClone.filter[1][1][1][2] = ''
        styleClone.filter[1][2][1][2] = ''
      } else {
        styleClone.filter[1][2] = ''
      } // remove the cloned style value since we're adding a new value

      onStylesChange([...styles, styleClone])
    } catch (e) {
      console.error(e, styles) // eslint-disable-line

      throw new Error('There was an error trying to clone an existing style')
    }
  }

  debounceAttributeChange = ({ target }) => {
    const { styles, onStylesChange } = this.props
    const newStyles = [...styles]

    try {
      onStylesChange(newStyles.map(s => {
        // styles will look like this ['&&', ['==', 'attribute', 'value'] ...]
        // so to change the attribute we're styling, we need to hit [1][1]
        s.filter[1][1] = target.value

        return s
      }))
    } catch (e) {
      throw new Error('The style object\'s filter was not able to be modified')
    }
  }

  debounceValueChange = (idx, val) => {
    const { styles, onStylesChange, commaDelimitedAttributes } = this.props
    const newStyles = [...styles]

    try {
      const att = newStyles[idx].filter[1][1] instanceof Array
        ? newStyles[idx].filter[1][1][1][1] : styles[idx].filter[1][1]

      if (commaDelimitedAttributes.includes(att)) {
        newStyles[idx].filter[1] = ['||',
          ['*=',
            ['FN_strMatches', att, `.*,( )??${escapeRegExp(val)}( )??$`],
            true
          ],
          ['*=',
            ['FN_strMatches', att, `.*,( )??${escapeRegExp(val)}( )??,.*`],
            true
          ],
          ['*=',
            ['FN_strMatches', att, `^${escapeRegExp(val)}( )??,.*`],
            true
          ],
          ['==', att, val]
        ]
      } else {
        newStyles[idx].filter[1][2] = val
      }

      onStylesChange(newStyles)
    } catch (e) {
      throw new Error('The style object\'s filter was not able to be modified', styles)
    }
  }

  trimValue = (regExp) => {
    // when values are added in they are an empty string, if they are empty we don't need to trim
    if (regExp) {
      const removedFirstHalf = regExp.slice(8)
      const nextStartToRemove = removedFirstHalf.indexOf('(')
      const value = removedFirstHalf.slice(0, nextStartToRemove)

      return value
    } else {
      return regExp
    }
  }

  render () {
    const { translations, styles, attributes, attributeValues } = this.props
    // since styles are grouped, if the first doesn't have filter, neither will the others
    const hasFilter = styles[0].filter

    // filters can have 3 different levels of nesting -- these two funcs handle all three cases
    const getAttributeValue = (filter = []) => {
      if (!filter || !filter.length) return ''

      // these checks see if the item at index 1 is a string (meaning no more nesting)
      if (typeof filter[1] === 'string') return filter[1]
      if (typeof filter[1][1] === 'string') return filter[1][1]
      if (typeof filter[1][1][1][1] === 'string') return filter[1][1][1][1]
    }

    const getSelectedValue = (filter = []) => {
      if (!filter || !filter.length) return ''

      // these checks see if the item at index 2 is a string (meaning no more nesting)
      if (typeof filter[2] === 'string') return filter[2]
      if (typeof filter[1][2] === 'string') return filter[1][2]
      if (typeof filter[1][1][1][2] === 'string') return this.trimValue(filter[1][1][1][2])
    }

    return (
      <Card>
        {styles.length &&
          <AttributeContainer>
            {hasFilter &&
              <Half>
                <FormControl style={{ width: '200px', margin: '15px' }}>
                  <InputLabel htmlFor='attribute-selector'>{translations['olKit.StyleGroup.chooseAttribute']}</InputLabel>
                  <Select
                    value={getAttributeValue(styles[0].filter)}
                    onChange={this.debounceAttributeChange}>
                    {attributes.map(a => {
                      return <MenuItem key={a} value={a}>{a}</MenuItem>
                    })}
                  </Select>
                </FormControl>
              </Half>
            }
            <Half>
              <DeleteGroup>
                <DeleteGroupText onClick={this.onDeleteStyleGroup}>{translations['olKit.StyleGroup.delete']}</DeleteGroupText>
              </DeleteGroup>
            </Half>
          </AttributeContainer>
        }
        <div>
          {styles.map((s, i) => {
            // some styles are hidden when displaying zoomed in/out stylings
            return s.hidden
              ? null
              : (
                <Fragment>
                  <StyleContainer key={`${getAttributeValue(s.filter)}-${i}`}>
                    {hasFilter &&
                      <Selector
                        style={{ flex: 1 }}
                        header={translations['olKit.StyleGroup.value']}
                        onClick={() => this.props.getValuesForAttribute(getAttributeValue(s.filter))}
                        selected={getSelectedValue(s.filter)}
                        options={attributeValues.map(v => `${v}`) /* string interpolation here ensures booleans display properly */}
                        onValueChange={(e) => this.debounceValueChange(i, e)} />
                    }
                  </StyleContainer>
                  <StyleContainer>
                    <GenericSymbolizer
                      symbolizers={s.symbolizers}
                      translations={translations}
                      onSymbolizerChange={(s) => this.onSymbolizerChange(s, i)}
                      onSymbolizerDelete={(s) => this.onSymbolizerDelete(i)} />
                  </StyleContainer>
                </Fragment>
              )
          })}
          <AddNewContainer>
            <AddNew onClick={this.onNewStyleValue}>
              <i className='zmdi zmdi-plus-circle' /> {translations['olKit.StyleGroup.addValue']}
            </AddNew>
          </AddNewContainer>
        </div>
      </Card>
    )
  }
}

StyleGroup.propTypes = {
  /** Object with key/value pairs for translated strings */
  translations: PropTypes.object,

  /**  */
  styles: PropTypes.array,

  /** */
  attributes: PropTypes.array,

  /** */
  onStylesChange: PropTypes.func.isRequired,
  getValuesForAttribute: PropTypes.func,
  attributeValues: PropTypes.array,
  commaDelimitedAttributes: PropTypes.array
}

StyleGroup.defaultProps = {
  onStylesChange: () => {},
  attributeValues: [],
  translations: {
    'olKit.StyleGroup.chooseAttribute': 'Choose an Attribute',
    'olKit.StyleGroup.delete': 'Delete Style Group',
    'olKit.StyleGroup.value': 'Value',
    'olKit.StyleGroup.addValue': 'Add Value'
  }
}

export default StyleGroup
