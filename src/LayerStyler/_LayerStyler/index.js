import React, { Component } from 'react'
import PropTypes from 'prop-types'

import SelectTabs from 'LayerStyler/_SelectTabs'
import StyleGroup from './_StyleGroup'
import AddCircleIcon from '@material-ui/icons/AddCircle';
import {
  Button,
  ButtonContainer,
  Half,
  AddNew,
  ResetText,
  CollapseText,
  StyleGroupHeading
} from './styled'

const DEFAULT_STYLE = {
  name: 'New Auto Style',
  filter: [
    '&&',
    ['==', '', '']
  ],
  symbolizers: [{
    kind: 'Mark',
    color: '#ffffff',
    radius: 4,
    strokeColor: '#000000',
    strokeWidth: 2,
    wellKnownName: 'Circle'
  }, {
    kind: 'Line',
    color: '#ffffff',
    width: 7
  }, {
    kind: 'Fill',
    color: '#ffffff',
    opacity: 1,
    outlineColor: '#000000',
    outlineWidth: 4
  }]
}

class LayerStyler extends Component {
  collapse = () => {
    this.props.onCollapseToggle()
  }

  // in order to handle styling for different geom
  // types all at once, we create three symbolizers
  createStyleGroup = (type) => {
    const { styles = [], onStylesChange } = this.props

    // we do this stringify/parse here to perform a quick & dirty deep clone
    const defaultClone = JSON.parse(JSON.stringify(DEFAULT_STYLE))
    const styling = [defaultClone, ...styles.map(group => group.reverse())]

    onStylesChange(styling)
  }

  // when a style is changed, update
  onStylesChange = (stylesArr, i) => {
    const { styles, onStylesChange } = this.props
    const newStyles = [...styles]


    // this reverse is done b/c the incoming styles are reversed so
    // the top-most item is actually the last item rendered by GS so it's "on top"
    // in the z index stack
    newStyles[i] = stylesArr

    onStylesChange(newStyles.map(group => group.reverse()))
  }

  render () {
    const {
      translations,
      collapsed,
      styles,
      isDefaultStyler,
      attributes,
      heading,
      showNewButtons,
      getValuesForAttribute,
      commaDelimitedAttributes,
      onDefaultStyleReset
    } = this.props
    const zoomedInStyles = []
    const zoomedOutStyles = []

    if (isDefaultStyler) {
      // for default styler push the symbolizers into the appropriate arrays: kind 'Mark' is zoomed out (point), kind 'Fill' is zoomed in
      styles.forEach(styleGroup => styleGroup.forEach(style => {
        if (style.symbolizers[0].kind === 'Mark') zoomedOutStyles.push(style)
        else zoomedInStyles.push(style)
      }))
    }
    // only show the tabs when there are two distinct zoom level stylings
    const showTabs = !!(zoomedInStyles.length && zoomedOutStyles.length)

    return (
      <div>
        <ButtonContainer>
          <Half>
            <StyleGroupHeading id={heading}>
              {heading}
              {showNewButtons &&
                <AddNew
                  data-testid={'LayerStyler.addStyle'}
                  onClick={this.createStyleGroup}>
                  <AddCircleIcon />
                </AddNew>
              }
              {onDefaultStyleReset && <ResetText onClick={onDefaultStyleReset}>{translations['_ol_kit.LayerStyler.reset']}</ResetText>}
            </StyleGroupHeading>
          </Half>
          <CollapseText>
            {styles.length > 0 && <Button onClick={this.collapse}>{collapsed ? translations['_ol_kit.LayerStyler.show'] : translations['_ol_kit.LayerStyler.hide']}</Button>}
          </CollapseText>
        </ButtonContainer>
        {!showTabs && !collapsed
          ? (
            styles.map((styleGroup, i) => {
              const mutatedStyleGroup = styleGroup.map(style => ({ ...style, hidden: false }))

              return <StyleGroup
                inputProps={{
                  'data-testid':'LayerStyler.StyleGroup'
                }}
                translations={translations}
                commaDelimitedAttributes={commaDelimitedAttributes}
                styles={mutatedStyleGroup}
                getValuesForAttribute={getValuesForAttribute}
                attributeValues={this.props.attributeValues}
                attributes={attributes}
                onStylesChange={(styles) => this.onStylesChange(styles, i)}
                key={i} />
            })) : null
        }
        {showTabs && !collapsed
          ? (
            <SelectTabs>
              <div title={translations['_ol_kit.LayerStyler.zoomedIn']}>
                {styles.map((styleGroup, i) => {
                  const mutatedStyleGroup = styleGroup.map(style => {
                    // pass a hidden flag for non zoomed in styles to the StyleGroup component to keep the indexes on styles aligned
                    const hidden = !zoomedInStyles.find(zStyle => zStyle.name === style.name)

                    return { ...style, hidden }
                  })

                  return <StyleGroup
                    translations={translations}
                    commaDelimitedAttributes={commaDelimitedAttributes}
                    styles={mutatedStyleGroup}
                    getValuesForAttribute={getValuesForAttribute}
                    attributeValues={this.props.attributeValues}
                    attributes={attributes}
                    onStylesChange={(styles) => this.onStylesChange(styles, i)}
                    key={i} />
                })}
              </div>
              <div title={translations['_ol_kit.LayerStyler.zoomedOut']}>
                {styles.map((styleGroup, i) => {
                  const mutatedStyleGroup = styleGroup.map(style => {
                    // pass a hidden flag for non zoomed out styles to the StyleGroup component to keep the indexes on styles aligned
                    const hidden = !zoomedOutStyles.find(zStyle => zStyle.name === style.name)

                    return { ...style, hidden }
                  })

                  return <StyleGroup
                    translations={translations}
                    commaDelimitedAttributes={commaDelimitedAttributes}
                    styles={mutatedStyleGroup}
                    getValuesForAttribute={getValuesForAttribute}
                    attributeValues={this.props.attributeValues}
                    attributes={attributes}
                    onStylesChange={(styles) => this.onStylesChange(styles, i)}
                    key={i} />
                })}
              </div>
            </SelectTabs>
          ) : null
        }
      </div>
    )
  }
}

LayerStyler.propTypes = {
  /** Object with key/value pairs for translated strings */
  translations: PropTypes.object,

  /** An array of styles */
  styles: PropTypes.array,

  /** Header text shown above the style cards */
  heading: PropTypes.string.isRequired,

  /** An array of attributes for the layer being styled */
  attributes: PropTypes.arrayOf(PropTypes.string).isRequired,

  /** A boolean which determines if the style cards are visible or collapsed */
  collapsed: PropTypes.bool,

  /** A boolean which determines if the styler is showing default styles */
  isDefaultStyler: PropTypes.bool,

  /** Show a plus icon to create new style cards */
  showNewButtons: PropTypes.bool,

  /** Callback fired when the style section has been collapsed */
  onCollapseToggle: PropTypes.func.isRequired,

  /** Callback fired when the styles change (receives an array of the current styles) */
  onStylesChange: PropTypes.func.isRequired,

  /** Callback fired when the user clicks the "reset to default" button */
  onDefaultStyleReset: PropTypes.func,

  /** Callback function which resolves a promise to the values available for a given attribute */
  getValuesForAttribute: PropTypes.func,

  attributeValues: PropTypes.array,
}

LayerStyler.defaultProps = {
  styles: [],
  heading: '',
  attributes: [],
  collapsed: false,
  isDefaultStyler: false,
  showNewButtons: false
}

export default LayerStyler
