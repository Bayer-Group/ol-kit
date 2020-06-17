import moment from 'moment'
import React from 'react'
import PropTypes from 'prop-types'
import debounce from 'lodash.debounce'
// update to @material-ui/pickers v4 when they add range support:
// https://github.com/mui-org/material-ui-pickers/issues/364#issuecomment-575697596
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers'
import MomentUtils from '@date-io/moment'

import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import SyncIcon from '@material-ui/icons/Sync'

import { connectToMap } from 'Map'
import {
  Container,
  LayerTitle,
  DateContainer,
  MarkContainer,
  TimesliderBar,
  HighlightedRange,
  BarContainer,
  DateMark,
  BottomContainer,
  Tickmark,
  TooManyForPreview
} from './styled'

// these are faster and more native than using momentjs
const datesSameDay = (first, second) =>
  (!first || !second) ? false : (
    first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate())
const datesDiffDay = (first, second) => !datesSameDay(first, second)

const MAX_DATES = 300

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

class TimeSliderBase extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      dates: [],
      numOfDays: 0,
      selectedDate: null,
      selectedDateRange: [],
      leftPosition: 0,
      rangeMin: 0,
      rangeMax: 0,
      isMouseDown: false,
      firstDayOfFirstMonth: undefined,
      idx: 0
    }

    // these refs are used to increase performance & calculcate offsets
    this.highlightDiv = null
    this.containerNode = null
    this.dateContainerDiv = null
    this.markContainer = null

    this.moveHandler = e => this.fetchFeaturesForCurrentExtent()
    this.keydownHandler = e => this.cycleDates(e.key)
  }

  componentDidMount () {
    console.log('DID MOUNT BASE')
    this.props.map.on('moveend', debounce(this.moveHandler, 1000))
    // this.props.layer.on('filter:change', this.moveHandler)

    // this listener allows the user to go next/back through the data via arrow keys
    document.addEventListener('keydown', this.keydownHandler)

    // kicks off the process of fetching features for the current extent
    this.fetchFeaturesForCurrentExtent()
  }

  componentWillUnmount () {
    this.props.map.un('moveend', this.moveHandler)
    // this.props.layer.un('filter:change', this.moveHandler)
    document.removeEventListener('keydown', this.keydownHandler)
  }

  fetchFeaturesForCurrentExtent = () => {
    // const { map, layer } = this.props
    // const extent = map.getView().calculateExtent()

    // // use the geoserver methods to request intersection features -- then pull their dates off them
    // layer.fetchFeaturesIntersectingExtent(extent, { featureTypes: [] }).then(res => {
    //   if (res.length < MAX_DATES) {
    //     const dates = res
    //       .map(f => new Date(f.get(layer.getTimeAttribute()))) /* we convert all dates to JS dates for easier use */
    //       .sort((a, b) => a - b) /* the sort must happen before the filter in order to remove dup dates */
    //       .filter((d, i, a) => datesDiffDay(a[i], a[i - 1])) /* this removes dup dates (precision is down to the day) */

    //     const firstDayOfFirstMonth = moment(dates[0]).startOf('month')

    //     this.setState({
    //       dates,
    //       tooManyDates: false,
    //       selectedDate: null,
    //       selectedDateRange: [],
    //       firstDayOfFirstMonth: firstDayOfFirstMonth,
    //       numOfDays: moment(dates[dates.length - 1]).diff(moment(dates[0]), 'days', true)
    //     })
    //   } else {
    //     this.setState({ tooManyDates: true })
    //   }
    // })
  }

  calculateLeftPlacement = (date, elementWidth, containerWidth, padding = 24) => {
    const { dates } = this.state

    const adjustedContainerWidth = containerWidth - padding // the useable area within the container is the container's width minus the padding
    const datesInRange = moment(dates[dates.length - 1]).diff(moment(dates[0])) // the length of time represented in the current range
    const timeToPixels = adjustedContainerWidth / datesInRange // the ratio of time to pixels
    const deltaTime = moment(date).diff(moment(dates[0])) // the length of time that has elapsed since the first date in the range
    /**
      deltaTime * timeToPixels => the number of pixels represented by the time thast has elapsed
      deltaTime * timeToPixels - (elementWidth / 2) => subtract half of the element's width to center the placed elements
      (deltaTime * timeToPixels - (elementWidth / 2)) + padding => compensate for the padding
    */
    const initialLeftPosition = (deltaTime * timeToPixels - (elementWidth / 2)) + padding
    const leftPosition = initialLeftPosition < adjustedContainerWidth // if the calculated position is greater than the total length (this typically happens with the last element in the range) we need to subtract the padding
      ? initialLeftPosition
      : initialLeftPosition - padding

    return leftPosition >= 0 ? leftPosition : 0 // safety check to make sure we don't end up with any negative values
  }

  calculateDateSliderPosition = (date, e) => {
    const { rangeMin, rangeMax, dates } = this.state
    const { leftDate, rightDate } = this.setDatesForCalendar(rangeMin, rangeMax)

    if (rangeMax - rangeMin !== 0) {
      this.setState({
        isMouseDown: false,
        selectedDateRange: [leftDate, rightDate],
        selectedDate: null
      })
      this.props.layer.getWMSLayer().getSource().updateParams({
        TIME: `${(new Date(leftDate)).toISOString().split('T')[0]}/${(new Date(rightDate)).toISOString().split('T')[0]}`
      })
    } else {
      this.setState({
        selectedDateRange: [dates[0], dates[dates.length - 1]]
      })
    }
  }

  setDatesForCalendar = (leftPosition, rightPosition) => {
    const { numOfDays, dates } = this.state
    const { width: timeSliderWidth } = this.containerNode.getBoundingClientRect()
    const leftDate = (leftPosition / (timeSliderWidth - 4)) * numOfDays
    const rightDate = (rightPosition / (timeSliderWidth + 4)) * numOfDays

    return {
      leftDate: new Date(moment(dates[0]).add(leftDate, 'days')),
      rightDate: new Date(moment(dates[0]).add(rightDate, 'days'))
    }
  }

  cycleDates = direction => {
    const { selectedDate, dates } = this.state
    const index = dates.findIndex(d => d === selectedDate)

    // if no single date is selected and you hit the right arrow key
    // set the first possible date as the selected date
    if (direction === 'ArrowRight' && selectedDate === null) return this.setSelectedDate(dates[0])

    // depending on right/left arrow we select the next/previous date
    if (direction === 'ArrowRight') {
      index + 1 === dates.length
        ? this.setSelectedDate(dates[dates.length - 1])
        : this.setSelectedDate(dates[index + 1])
    } else if (direction === 'ArrowLeft') {
      index - 1 < 0
        ? this.setSelectedDate(dates[0])
        : this.setSelectedDate(dates[index - 1])
    }
  }

  setSelectedDate = selectedDate => {
    // if a single date is selected, you cannot also have a date range selected
    this.setState({
      selectedDate,
      selectedDateRange: []
    })

    // update the layer to reflect the time extent selected
    this.props.layer.getWMSLayer().getSource().updateParams({
      TIME: `${(new Date(selectedDate)).toISOString().split('T')[0]}/${(new Date(selectedDate)).toISOString().split('T')[0]}`
    })
  }

  updateSelectedRange (first, second) {
    if (first < second) {
      this.setState({ rangeMin: first, rangeMax: second })
    } else {
      this.setState({ rangeMin: second, rangeMax: first })
    }
  }

  // this tracks if the mouse is being dragged on the slider
  handleMouseDown = e => {
    this.setState({
      isMouseDown: true,
      mouseDownEpoch: Date.now(),
      firstPosition: e.pageX - this.containerNode.getBoundingClientRect().left
    })
  }

  // we do a direct DOM access to avoid tons of setState re-renders
  handleMouseMove = e => {
    const { isMouseDown, firstPosition } = this.state

    if (isMouseDown) {
      const secondPosition = e.clientX - this.containerNode.getBoundingClientRect().left

      this.updateSelectedRange(firstPosition, secondPosition)
    }
  }

  handleMouseUp = e => {
    const { rangeMin, rangeMax, mouseDownEpoch } = this.state
    // const rightPosition = e.pageX - this.containerNode.getBoundingClientRect().left
    const { leftDate, rightDate } = this.setDatesForCalendar(rangeMin, rangeMax)

    this.calculateDateSliderPosition()

    // we manually calculate if the mouse is being clicked vs dragged
    if (Date.now() - mouseDownEpoch > 250) {
      this.setState({
        isMouseDown: false,
        selectedDate: null,
        selectedDateRange: [leftDate, rightDate]
      })
    } else {
      this.setState({ isMouseDown: false })
    }
  }

  resetState = () => {
    this.setState({
      selectedDate: null,
      selectedDateRange: []
    })

    // update the layer to reflect the time extent selected
    this.props.layer.getWMSLayer().getSource().updateParams({
      TIME: null
    })

    // refresh the layer source to update the map
    this.props.layer.getWMSLayer().getSource().refresh()
  }

  // loops through the date range and renders the dates on the top of the timeslider
  renderLabels = (dates, firstDayOfFirstMonth) => {
    const display = date => moment(date).format(`MMM 'YY`)
    const padding = 24

    // if no dates or ref is undefined, do not proceed
    if (!dates?.length || !this.dateContainerDiv) return

    const { width: containerWidth } = this.dateContainerDiv.getBoundingClientRect()
    const monthsInRange = Math.ceil(moment(dates[dates.length - 1]).diff(moment(dates[0]), 'months', true)) // the ceiling number of months in the range to avoid vals < 1
    const calcLabelWidth = (divisor) => (containerWidth - padding) / (monthsInRange / divisor) // calculate the width of the label
    const datesDiv = []

    let divisor = 1

    while (calcLabelWidth(divisor) < 50 && divisor < 10) divisor += 1 // make sure our labels are at least 50px wide but only try for 10 iterations
    const labelWidth = calcLabelWidth(divisor)

    for (let i = 0; i < monthsInRange; i += divisor) { // interate by the divisor
      const futureMonth = moment(firstDayOfFirstMonth).add(i, 'M')
      const position = i > 0 ? i / divisor : 0 // get the current date's position relative to the other date labels
      const initialLeftPosition = position * labelWidth + padding
      const leftPosition = initialLeftPosition <= containerWidth ? initialLeftPosition : initialLeftPosition - padding // calculate the position of the label with a similar algorithm to that described in calculateLeftPlacement

      datesDiv.push(<DateMark
        key={i}
        left={leftPosition}
        width={labelWidth}>{display(futureMonth)}</DateMark>)
    }

    return datesDiv
  }

  // loops through the captured data and displays a mark for each image
  renderMarks = () => {
    const { dates, selectedDate } = this.state
    const padding = 24

    if (!this.markContainer) return
    const { width: containerWidth } = this.markContainer.getBoundingClientRect()

    const thingy = dates.map((date, i) => {
      const leftPosition = this.calculateLeftPlacement(date, 4, containerWidth, padding)

      return (
        <Tickmark
          key={i}
          selected={moment(dates[i]).isSame(selectedDate)}
          style={{ left: `${leftPosition}px` }}>
        </Tickmark>
      )
    })

    return thingy
  }

  onTabClicked = (_, idx) => {
    this.setState({ idx })
  }

  render () {
    const { layers, translations } = this.props
    const {
      tooManyDates,
      dates,
      selectedDate,
      selectedDateRange,
      firstDayOfFirstMonth,
      rangeMin,
      rangeMax,
      idx
    } = this.state

    return (
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <div id='ContainerNode' ref={node => { this.containerNode = node }}>
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
                  {layers.map((l, i) => (
                    <Tab label={`Layer ${i + 1}`} key={i} />
                  ))}
                </Tabs>
                {tooManyDates ? (
                  <TooManyForPreview>{translations['advancedTimeSlider.tooMany']}</TooManyForPreview>
                ) : (
                  <React.Fragment>
                    {layers.map((l, i) => (
                      <TabPanel value={idx} key={i}>
                        <LayerTitle>{`Layer ${i + 1} - ${l.get('title')}`}</LayerTitle>
                        <DateContainer ref={n => { this.dateContainerDiv = n }}>
                          {this.renderLabels(dates, firstDayOfFirstMonth)}
                        </DateContainer>
                        <BarContainer
                          onMouseDown={this.handleMouseDown}
                          onMouseUp={this.handleMouseUp}
                          onMouseMove={this.handleMouseMove}>
                          <TimesliderBar barPlacement={16} barHeight={2} />
                          <MarkContainer
                            ref={n => { this.markContainer = n }}>
                            {this.renderMarks()}
                          </MarkContainer>
                          <HighlightedRange
                            style={{ display: rangeMin || rangeMax ? 'block' : 'none' }}
                            left={rangeMin}
                            right={rangeMax}
                            width={rangeMax - rangeMin}
                            ref={n => { this.highlightDiv = n }} />
                        </BarContainer>
                      </TabPanel>
                    ))}
                  </React.Fragment>
                )}
                <BottomContainer>
                  {translations['advancedTimeSlider.dateRange'] || 'Date Range'}
                  <DatePicker
                    disableFuture
                    variant='inline'
                    format='DD/MM/YYYY'
                    value={selectedDateRange.length ? selectedDateRange[0] : dates[0]}
                    onChange={date => {
                      this.calculateDateSliderPosition()
                      const { width } = this.containerNode.getBoundingClientRect()

                      this.setState({
                        selectedDateRange: [date, selectedDateRange[1]],
                        rangeMin: this.calculateLeftPlacement(date, 1, width, 24)
                      })
                    }} />
                  {` ${translations['advancedTimeSlider.to'] || 'To'} `}
                  <DatePicker
                    disableFuture
                    variant='inline'
                    format='DD/MM/YYYY'
                    value={selectedDateRange.length ? selectedDateRange[1] : dates[dates.length - 1]}
                    onChange={date => {
                      this.calculateDateSliderPosition()
                      const { width } = this.containerNode.getBoundingClientRect()

                      this.setState({
                        selectedDateRange: [selectedDateRange[0], date],
                        rangeMax: this.calculateLeftPlacement(date, 1, width, 24)
                      })
                    }} />

                  <Button disabled={!selectedDate} onClick={() => this.cycleDates('ArrowLeft')} variant='contained' color='primary' style={{ marginRight: '5px' }}>
                    {translations['advancedTimeSlider.previous']}
                  </Button>
                  <Button disabled={datesSameDay(selectedDate, dates[dates.length - 1])} onClick={() => this.cycleDates('ArrowRight')} variant='contained' color='primary'>
                    {translations['advancedTimeSlider.next']}
                  </Button>

                  <IconButton onClick={this.resetState}>
                    <SyncIcon color='primary' />
                  </IconButton>
                </BottomContainer>
                <IconButton onClick={this.onCloseClicked} style={{ position: 'absolute', top: '5px', right: '5px' }} aria-label='delete'>
                  <CloseIcon />
                </IconButton>
              </Card>
            </Grid>
          </Container>
        </div>
      </MuiPickersUtilsProvider>
    )
  }
}

TimeSliderBase.propTypes = {
  map: PropTypes.object.isRequired,
  layer: PropTypes.object.isRequired,
  sidebarOpen: PropTypes.bool,
  translations: PropTypes.object
}

export default connectToMap(TimeSliderBase)
