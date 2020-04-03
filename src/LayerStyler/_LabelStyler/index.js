import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import ColorPicker from 'LayerStyler/_ColorPicker'

import {
  TopControls,
  AttributeContainer,
  AttributeItem,
  ToggleContainer,
  SymbolizerContainer,
  AttributeHeader,
  Title,
  Button,
  ButtonText,
  Color,
  Outline,
  Size,
  Unit,
  Switch
} from './styled'

const DIVIDER = ':'
const UNITS = {
  ft: ['100ft', '125ft', '150ft', '250ft', '500ft', '750ft', '1000ft', '1250ft', '1500ft', '1750ft', '2000ft'],
  px: ['8px', '10px', '12px', '14px', '16px', '20px', '24px', '30px', '36px', '42px', '48px', '60px', '72px', '96px']
}

class LabelStyler extends Component {
  constructor (props) {
    super(props)

    this.state = {
      uglyChecked: false
    }
  }

  aggregateChanges = (key, value) => {
    const { style, onStylesChange } = this.props

    try {
      const newSymbolizer = {
        ...style.symbolizers[0],
        [key]: value
      }

      style.symbolizers = [newSymbolizer]
    } catch (err) {
      console.error(err) // eslint-disable-line

      throw new Error('Failed to aggregate changes to the style')
    }

    onStylesChange([style])
  }

  updateTextSizeUnit = unit => {
    this.aggregateChanges('size', unit === 'ft' ? '250ft' : '16px')
  }

  onAttributeChange = (attr, checked) => {
    const { style, onStylesChange } = this.props
    const newStyle = { ...style }

    try {
      const labelParts = newStyle.symbolizers[0].label.split(DIVIDER)

      let newLabel

      // if the item was previously checked,
      if (checked) {
        newLabel = labelParts.filter(p => p !== `{{${attr}}}`).join(DIVIDER)
      } else {
        // the inner filter here removes empty strings which will add an extra divider
        // which we don't want when the .join() happens
        newLabel = [...labelParts.filter(p => p), `{{${attr}}}`].join(DIVIDER)
      }

      newStyle.symbolizers[0].label = newLabel
    } catch (err) {
      console.error(err) // eslint-disable-line

      throw new Error('Failed to modify the symbolizer label')
    }

    onStylesChange([newStyle])
  }

  clearCheckedItems = () => {
    const { style, onStylesChange } = this.props

    try {
      style.symbolizers[0].label = ''
    } catch (err) {
      console.error(err) // eslint-disable-line

      throw new Error('There was an issue setting the symbolizer label')
    }

    onStylesChange([style])
  }

  onToggle = () => {
    const { style, onStylesChange } = this.props
    const { uglyChecked } = this.state
    const newStyleSymbolizer = {
      ...style.symbolizers[0],
      spaceAround: uglyChecked ? -5 : 5,
      partials: uglyChecked,
      repeat: uglyChecked ? 1 : 100,
      autoWrap: 100,
      maxDisplacement: 0,
      group: 'no',
      conflictResolution: !uglyChecked,
      goodnessOfFit: 0.1,
      labelAllGroup: false,
      polygonAlign: 'mbr'
    }

    onStylesChange([{ ...style, symbolizers: [newStyleSymbolizer] }])
    this.setState({ uglyChecked: !this.state.uglyChecked })
  }

  render () {
    const { uglyChecked } = this.state
    const { translations, attributes, style } = this.props

    if (!style) return <div>{translations['olKit.LabelStyler.noLabelSupport']}</div>

    const symbolizer = style.symbolizers[0]
    const checkedAttributes = symbolizer.label.split(DIVIDER)
    const sizeUnit = symbolizer.size.slice(-2)

    return (
      <div>
        <TopControls>
          <ToggleContainer>
            <span>{translations['olKit.LabelStyler.enableSmartLabels']}</span>
            <Switch
              checked={uglyChecked}
              onChange={this.onToggle}
              inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
          </ToggleContainer>
          <SymbolizerContainer>
            <Color>
              <Title>{translations['olKit.LabelStyler.color']}</Title>
              <ColorPicker handleSelect={(val) => this.aggregateChanges('color', val)} currentColor={symbolizer.color} />
            </Color>
            <Outline>
              <Title>{translations['olKit.LabelStyler.outline']}</Title>
              <ColorPicker handleSelect={(val) => this.aggregateChanges('haloColor', val)} currentColor={symbolizer.haloColor} />
            </Outline>
            <Size>
              <Title>{translations['olKit.LabelStyler.textHeight']}</Title>
              <Select
                style={{ marginTop: '10px' }}
                value={symbolizer.size}
                onChange={e => this.aggregateChanges('size', e.target.value)}>
                {UNITS[sizeUnit].map(s => {
                  return <MenuItem key={s} value={s}>{s}</MenuItem>
                })}
              </Select>
            </Size>
            <Unit>
              <Title>{translations['olKit.LabelStyler.textUnits']}</Title>
              <Select
                style={{ marginTop: '10px' }}
                value={sizeUnit}
                onChange={e => this.updateTextSizeUnit(e.target.value)}>
                <MenuItem key='px' value={'px'}>{translations['olKit.LabelStyler.pixels']}</MenuItem>
                <MenuItem key='ft' value={'ft'}>{translations['olKit.LabelStyler.feet']}</MenuItem>
              </Select>
            </Unit>
          </SymbolizerContainer>
        </TopControls>
        <AttributeHeader>
          <div>{translations['olKit.LabelStyler.chooseAttrs']}</div>
          {checkedAttributes.length && (
            <Button onClick={this.clearCheckedItems}>
              <ButtonText>{translations['olKit.LabelStyler.clear']}</ButtonText>
            </Button>
          )}
        </AttributeHeader>
        <AttributeContainer data-testid='ManageLayer.attributeContainer'>
          {attributes.map(a => {
            const checked = checkedAttributes.includes(`{{${a}}}`)

            return (
              <AttributeItem key={a} checked={checked} onClick={() => this.onAttributeChange(a, checked)}>
                {a}
              </AttributeItem>
            )
          })}
        </AttributeContainer>
      </div>
    )
  }
}

LabelStyler.propTypes = {
  /** Object with key/value pairs for translated strings */
  translations: PropTypes.object,

  /** array of label styles */
  style: PropTypes.object.isRequired,

  /** array of attributes for the layer */
  attributes: PropTypes.array.isRequired,

  /** callback when label styles change */
  onStylesChange: PropTypes.func.isRequired
}

LabelStyler.defaultProps = {
  style: {},
  attributes: [],
  onStylesChange: () => {},
  translations: {
    'olKit.LabelStyler.noLabelSupport': 'This layer does not support labelling.',
    'olKit.LabelStyler.enableSmartLabels': 'Enable smart labels',
    'olKit.LabelStyler.color': 'Color',
    'olKit.LabelStyler.outline': 'Outline',
    'olKit.LabelStyler.textHeight': 'Text Height',
    'olKit.LabelStyler.textUnits': 'Text Size Units',
    'olKit.LabelStyler.pixels': 'Pixels',
    'olKit.LabelStyler.feet': 'Feet',
    'olKit.LabelStyler.chooseAttrs': 'Choose Attributes to Display',
    'olKit.LabelStyler.clear': 'Clear All'
  }
}

export default LabelStyler
