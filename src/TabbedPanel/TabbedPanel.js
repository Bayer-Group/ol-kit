import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Card, Tabs, Tab, InitialTab } from './styled'

import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import { connectToContext } from 'Provider'

/**
 * @component
 * @category TabbedPanel
 * @since 1.3.0
 */
class TabbedPanel extends Component {
  constructor (props) {
    super(props)

    this.state = {
      activeIndex: 0,
      showPanel: true
    }
  }

  handleChange = (_, activeIndex) => {
    this.setState({ activeIndex, showPanel: true })
  }

  togglePanel = () => {
    this.setState({ showPanel: !this.state.showPanel })
  }

  hideLayerPanel = () => {
    this.setState({ showPanel: false })
  }

  render () {
    const { children, translations } = this.props
    const { activeIndex, showPanel } = this.state

    return (
      <>
        <Card open={showPanel} numoftabs={children.length || 1} className='_popup_boundary' >
          <div style={{ display: 'flex', background: 'rgb(237, 237, 237)' }}>
            <InitialTab onClick={this.togglePanel} icon={showPanel ? <KeyboardArrowDownIcon data-testid='MapPanel.close' /> : <KeyboardArrowRightIcon data-testid='MapPanel.open' />} />
            <Tabs
              open={showPanel}
              value={activeIndex}
              onChange={this.handleChange}
              variant='scrollable'
              scrollButtons='auto'>
              {React.Children.map(children, (child, i) => {
                if (child) return <Tab key={i + 1} label={child.props.tabIcon || child.props.label} />
              })}
            </Tabs>
          </div>
          {translations && React.Children.toArray(children)[activeIndex]}
        </Card>
      </>
    )
  }
}

TabbedPanel.defaultProps = {}

TabbedPanel.propTypes = {
  /** The pages of the panel (things like `LayerPanelPage` or `LayerStyler` components) */
  children: PropTypes.node.isRequired,

  /** A float number for the opacity of the LayerPanel. i.e. (0.5) */
  opacity: PropTypes.number,

  /** Object with key/value pairs for translated strings */
  translations: PropTypes.object
}

export default connectToContext(TabbedPanel)
