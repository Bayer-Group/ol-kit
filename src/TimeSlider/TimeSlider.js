import React from 'react'
import PropTypes from 'prop-types'
import Card from '@material-ui/core/Card'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import olObservable from 'ol/observable'

import TimeSliderBase from './TimeSliderBase'
import { connectToMap } from 'Map'
import { Container, LayerTitle } from './styled'

function TabPanel (props) {
  const { children, value, index, ...other } = props

  return (
    <Typography
      component='div'
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number,
  index: PropTypes.number
}

class TimeSlider extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      idx: 0,
      open: true
    }
  }

  componentDidMount = () => {
    const { map } = this.props
    const layers = map.getLayers()
    const handleLayerChange = e => {
      this.forceUpdate() // force a re-render if layers are added or removed
    }

    // bind the event listener
    this.layerListener = layers.on('change:length', handleLayerChange)
  }

  componentWillUnmount = () => {
    // unbind the listener
    olObservable.unByKey(this.layerListener)
  }

  onCloseClicked = () => {
    this.setState({ open: false })
  }

  onTabClicked = (_, idx) => {
    this.setState({ idx })
  }

  render () {
    const { map, translations } = this.props
    const { idx, open } = this.state
    const geoserverTimeEnabledLayers = map.getLayers().getArray().filter(l => l.isGeoserverLayer && !!l.getTimeAttribute()) // eslint-disable-line

    // if there are no geoserver layers on the map, don't render the time slider
    if (!geoserverTimeEnabledLayers.length || !open) return null

    return (
      <Container>
        <Grid container justify='center'>
          <Card style={{ width: '100%', paddingTop: '4px' }}>
            <Tabs
              style={{ marginRight: '60px' }}
              indicatorColor='primary'
              value={idx}
              onChange={this.onTabClicked}
              aria-label='simple tabs example'
              variant='scrollable'
              scrollButtons='auto'>
              {geoserverTimeEnabledLayers.map((l, i) => (
                <Tab label={`Layer ${i + 1}`} key={i} />
              ))}
            </Tabs>
            {geoserverTimeEnabledLayers.map((l, i) => (
              <TabPanel value={idx} index={i} key={i}>
                <LayerTitle>{`Layer ${i + 1} - ${l.get('title')}`}</LayerTitle>
                <TimeSliderBase layer={l} map={map} translations={translations} />
              </TabPanel>
            ))}
            <IconButton onClick={this.onCloseClicked} style={{ position: 'absolute', top: '5px', right: '5px' }} aria-label='delete'>
              <CloseIcon />
            </IconButton>
          </Card>
        </Grid>
      </Container>
    )
  }
}

TimeSlider.propTypes = {
  map: PropTypes.object.isRequired,
  translations: PropTypes.object
}

export default connectToMap(TimeSlider)
