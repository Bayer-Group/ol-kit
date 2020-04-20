import React, { Component } from 'react'
import PropTypes from 'prop-types'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'
import cloneDeep from 'lodash.clonedeep'

import AttributesFilter from 'LayerStyler/_AttributesFilter'
import LabelStyler from 'LayerStyler/_LabelStyler'
import LayerStyler from 'LayerStyler/_LayerStyler'
import SelectTabs from 'LayerStyler/_SelectTabs'
import { HeaderContainer, InputContainer, FilterContainer } from './styled'

const DEFAULT_LABEL_STYLE = {
  name: 'New Label Style',
  symbolizers: [{
    kind: 'Text',
    label: '',
    color: '#000',
    haloColor: '#fff',
    font: ['Arial'],
    size: '16px',
    haloWidth: 1,
    LabelPlacement: [{
      PointPlacement: {
        AnchorPoint: {
          AnchorPointX: 0.5,
          AnchorPointY: 0.5
        },
        Displacement: {
          DisplacementX: 0,
          DisplacementY: 0
        },
        Rotation: 0
      }
    }],
    fontStyle: 'normal',
    fontWeight: 'bold'
  }]
}

const getNonLabelStyles = (ss = []) => ss.filter(s => s.symbolizers[0].kind !== 'Text')
const getLabelStyle = (ss = []) => ss.find(s => s.symbolizers[0].kind === 'Text')

/**
 * @component
 * @category vmc
 * @example ./example.md
 */
class StyleManager extends Component {
  constructor (props) {
    super(props)

    this.state = {
      // we start with a null value which tells us nothing is selected
      activeIdx: null,
      userCollapsed: false,
      defaultCollapsed: true,
      values: []
    }
  }

  componentDidMount () {
    const { layers } = this.props

    // this auto-selects the item if there is only one layer to manage
    if (layers.length === 1) this.setState({ activeIdx: 0 })
  }

  handleLayerChange = ({ target }) => {
    const { layers, getTitleForLayer } = this.props
    const options = layers.map(getTitleForLayer)
    const activeIdx = options.findIndex(t => t === target.value)

    this.setState({ activeIdx })
  }

  onCollapseToggle (type) {
    this.setState({ [type]: !this.state[type] })
  }

  onFilterChange = filters => {
    const { activeIdx } = this.state
    const { layers, onFilterChange } = this.props

    onFilterChange(layers[activeIdx], filters)
  }

  onLabelStyleChange = styles => {
    const { activeIdx } = this.state
    const { layers, userStyles, onUserStyleChange } = this.props

    const newStyles = [...styles, ...getNonLabelStyles(userStyles[activeIdx])]

    onUserStyleChange(layers[activeIdx], newStyles)
  }

  onUserStyleChange = styleGroup => {
    const { activeIdx } = this.state
    const { layers, userStyles, onUserStyleChange } = this.props
    const newStyles = [...styleGroup.flat()]

    // if there is a label style, we unshift it onto the front of the styles
    const labelStyle = getLabelStyle(userStyles[activeIdx])

    if (labelStyle) newStyles.unshift(labelStyle)

    onUserStyleChange(layers[activeIdx], newStyles)
  }

  onDefaultStyleChange = styleGroup => {
    const { activeIdx } = this.state
    const { layers, onDefaultStyleChange } = this.props

    onDefaultStyleChange(layers[activeIdx], styleGroup.flat())
  }

  onDefaultStyleReset = () => {
    const { activeIdx } = this.state
    const { layers, onDefaultStyleReset } = this.props

    onDefaultStyleReset(layers[activeIdx])
  }

  render () {
    const {
      translations,
      filters,
      layers,
      userStyles,
      defaultStyles,
      getTitleForLayer,
      getAttributesForLayer,
      getValuesForAttribute,
      attributeValues,
      getCommaDelimitedAttributesForLayer
    } = this.props

    const {
      activeIdx,
      userCollapsed,
      defaultCollapsed
    } = this.state

    const groupStyles = styles => {
      // since filters include both keys & values (and values won't be the same)
      // we need to drop the values from the filters so we can group by similar filters
      // default to an empty array b/c there are styles without filters which will choke
      const trimFilters = (f = []) => {
        if (typeof f[2] === 'string') return f.slice(0, -1)

        return f.map(sf => {
          if (!Array.isArray(sf)) return sf

          if (typeof sf[2] === 'string') return sf.slice(0, -1)
          if (Array.isArray(sf[2])) return f[1][1][1][1] // this is accessing the filters attribute
        })
      }

      const dedup = {}

      styles?.forEach((s, i) => {
        const key = JSON.stringify(trimFilters(s.filter))
        const val = dedup[key] ? [...dedup[key], { ...s, _index: i }] : [{ ...s, _index: i }]

        dedup[key] = val
      })

      // the reverse here is to compensate for the fact that we store the styles with the most important last in the array
      return Object.values(dedup).map(group => group.reverse())
    }
    const layerTitles = layers.map(getTitleForLayer)
    const layerSelected = activeIdx !== null

    return (
      <div data-testid='StyleManager'>
        <HeaderContainer>
          <InputContainer>
            <FormControl style={{ width: '300px', margin: '20px' }}>
              <InputLabel htmlFor='layer-selector'>{translations['olKit.StyleManager.chooseLayer']}</InputLabel>
              <Select
                value={layerTitles[activeIdx] || ''}
                onChange={this.handleLayerChange}
                type='text'
                inputProps={{
                  id: 'layer-selector',
                  'data-testid': 'StyleManager.chooseLayer'
                }}>
                {layerTitles.map(t => {
                  return <MenuItem key={t} value={t}>{t}</MenuItem>
                })}
              </Select>
            </FormControl>
          </InputContainer>
        </HeaderContainer>
        {layerSelected &&
          <SelectTabs>
            <div title={translations['olKit.StyleManager.styleTab']}>
              <LayerStyler
                id='LayerStyler'
                translations={translations}
                heading={`${translations['olKit.StyleManager.customStyles']} (${getNonLabelStyles(userStyles[activeIdx])?.length})`}
                showNewButtons={true}
                collapsed={userCollapsed}
                getValuesForAttribute={attribute => getValuesForAttribute(layers[activeIdx], attribute)}
                attributeValues={attributeValues}
                layer={layers[activeIdx]}
                commaDelimitedAttributes={getCommaDelimitedAttributesForLayer?.(layers[activeIdx])}
                attributes={getAttributesForLayer(layers[activeIdx])}
                styles={groupStyles(getNonLabelStyles(userStyles[activeIdx]))}
                onCollapseToggle={() => this.onCollapseToggle('userCollapsed')}
                onStylesChange={this.onUserStyleChange} />
              <LayerStyler
                id='LayerStyler'
                translations={translations}
                heading={`${translations['olKit.StyleManager.defaultStyles']} (${defaultStyles[activeIdx]?.length || '0'})`}
                collapsed={defaultCollapsed}
                attributes={getAttributesForLayer(layers[activeIdx])}
                styles={groupStyles(defaultStyles[activeIdx])}
                onCollapseToggle={() => this.onCollapseToggle('defaultCollapsed')}
                onStylesChange={this.onDefaultStyleChange}
                onDefaultStyleReset={this.onDefaultStyleReset}
                isDefaultStyler={true} />
            </div>
            <div data-testid='StyleManager.labelTab' title={translations['olKit.StyleManager.labelTab']}>
              <LabelStyler
                style={getLabelStyle(userStyles[activeIdx]) || cloneDeep(DEFAULT_LABEL_STYLE)}
                attributes={getAttributesForLayer(layers[activeIdx])}
                onStylesChange={this.onLabelStyleChange} />
            </div>
          </SelectTabs>
        }
      </div>
    )
  }
}

StyleManager.propTypes = {
  /** Object with key/value pairs for translated strings */
  translations: PropTypes.object,

  /** array of style objects from the geostyler project */
  userStyles: PropTypes.array.isRequired,

  /** an array of style objects which are rendered as "default styles" */
  defaultStyles: PropTypes.array.isRequired,

  /** array of openlayers layer objects */
  filters: PropTypes.array.isRequired,

  /** array of openlayers layer objects */
  layers: PropTypes.array.isRequired,

  /** returns an array of strings representing the attributes */
  getAttributesForLayer: PropTypes.func.isRequired,

  /** returns a string which is the title of the layer given an OL layer */
  getTitleForLayer: PropTypes.func.isRequired,

  /** returns an array of strings representing the values for the selected attribute */
  getValuesForAttribute: PropTypes.func.isRequired,

  /** array of strings representing values for the selected attribute */
  attributeValues: PropTypes.array.isRequired,

  /** @since 6.6.0
  callback invoked when the filters change on layer */
  onFilterChange: PropTypes.func.isRequired,

  /** callback invoked when the user styles change */
  onUserStyleChange: PropTypes.func.isRequired,

  /** callback invoked when the default styles change */
  onDefaultStyleChange: PropTypes.func.isRequired,

  /** callback invoked when the default styles of the layer should be reset */
  onDefaultStyleReset: PropTypes.func.isRequired,

  /** callback invoked which returns attributes on the layer which are comma separated */
  getCommaDelimitedAttributesForLayer: PropTypes.func.isRequired
}

StyleManager.defaultProps = {
  translations: {
    'olKit.StyleManager.chooseLayer': 'Choose a layer to style',
    'olKit.StyleManager.styleTab': 'Styles',
    'olKit.StyleManager.labelTab': 'Labels',
    'olKit.StyleManager.customStyles': 'Custom Styles',
    'olKit.StyleManager.defaultStyles': 'Default Styles',
    'olKit.AttributesFilter.where': 'Where',
    'olKit.AttributesFilter.AND': 'AND',
    'olKit.AttributesFilter.OR': 'OR',
    'olKit.AttributesFilter.filters': 'Filters',
    'olKit.AttributesFilter.addFilter': 'Add Filter',
    'olKit.AttributesFilter.attribute': 'value',
    'olKit.AttributesFilter.condition': 'condition',
    'olKit.AttributesFilter.value': 'attribute',
    '_ol_kit.LayerStyler.reset': 'Reset Styles',
    '_ol_kit.LayerStyler.show': 'Show All',
    '_ol_kit.LayerStyler.hide': 'Hide All',
    '_ol_kit.LayerStyler.zoomedIn': 'Zoomed In',
    '_ol_kit.LayerStyler.zoomedOut': 'Zoomed Out',
    'olKit.StyleGroup.chooseAttribute': 'Choose an Attribute',
    'olKit.StyleGroup.delete': 'Delete Style Group',
    'olKit.StyleGroup.value': 'Value',
    'olKit.StyleGroup.addValue': 'Add Value',
    'olKit.GenericSymbolizer.fill': 'Fill',
    'olKit.GenericSymbolizer.width': 'Width',
    'olKit.GenericSymbolizer.stroke': 'Stroke',
    'olKit.GenericSymbolizer.remove': 'Remove',
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

export default StyleManager
