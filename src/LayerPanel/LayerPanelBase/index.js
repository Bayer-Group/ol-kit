import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Card, Tabs, Tab, InitialTab, CardContent } from './styled'
// material-ui-icons
import LayersIcon from '@material-ui/icons/Layers'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Typography from '@material-ui/core/Typography'
import { connectToContext } from 'Provider'

/**
 * @component
 * @category LayerPanel
 * @since 0.5.0
 */
class LayerPanelBase extends Component {
  constructor (props) {
    super(props)

    this.state = {
      activeIndex: 0,
      showLayerPanel: false
    }
  }

  handleChange = (_, activeIndex) => {
    this.setState({ activeIndex })
  }

  showLayerPanel = () => {
    this.setState({ showLayerPanel: true })
  }

  hideLayerPanel = () => {
    this.setState({ showLayerPanel: false })
  }

  render () {
    const { inline, style, children, translations, layerPanelTitle } = this.props
    const { activeIndex, showLayerPanel } = this.state
    const tabDataTestId = showLayerPanel ? 'LayerPanel.close' : 'LayerPanel.open'

    return (
      <>
        {!showLayerPanel && <InitialTab id='initialtab' onClick={this.showLayerPanel} icon={<LayersIcon data-testid={tabDataTestId} />} />}
        <Card open={showLayerPanel} styles={style} numoftabs={children.length || 1} inline={inline} className='_popup_boundary' >
          <CardContent>
            <Typography variant='h5' component='h5'>{layerPanelTitle}</Typography>
            <IconButton onClick={this.hideLayerPanel}><CloseIcon /></IconButton>
          </CardContent>
          <Tabs open={showLayerPanel} value={activeIndex} onChange={this.handleChange} >
            {showLayerPanel &&
              React.Children.map(children, (child, i) => {
                if (child) return <Tab key={i} label={child.props.tabIcon || child.props.label} />
              })
            }
          </Tabs>
          {translations && React.Children.toArray(children)[activeIndex]}
        </Card>
      </>
    )
  }
}

LayerPanelBase.propTypes = {
  /** Render the component inline (without absolute positioning) */
  inline: PropTypes.bool,

  /** The content of the layer panel (likely a set of `LayerPanelPage` components) */
  children: PropTypes.node.isRequired,

  /** An object of styles spread on the layerpanel */
  style: PropTypes.object,

  /** Title of the LayerPanel */
  layerPanelTitle: PropTypes.string,

  /** Object with key/value pairs for translated strings */
  translations: PropTypes.object
}

export default connectToContext(LayerPanelBase)
