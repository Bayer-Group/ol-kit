import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
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
import { datesDiffDay, datesSameDay } from './utils'

// const MAX_DATES = 300

function TabPanel (props) {
  const { children, value, index } = props

  return value === index && <Box p={3} style={{ padding: '10px 24px' }}>{children}</Box>
}

TabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number,
  index: PropTypes.number
}

/** TimeSliderBase component ui used by TimeSlider
 * @component
 * @category TimeSlider
 * @since 0.12.0
 */
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
      index: 0
    }

    // these refs are used to increase performance & calculcate offsets
    this.highlightDiv = null
    this.containerNode = null
    this.dateContainerDiv = null
    this.markContainer = null

    this.keydownHandler = e => this.cycleDates(e.key)
  }

  componentDidMount () {
    const { tabs } = this.props

    tabs.length && this.createDateTicks(tabs[this.state.index])
    // this.props.layer.on('filter:change', this.moveHandler)

    // this listener allows the user to go next/back through the data via arrow keys
    document.addEventListener('keydown', this.keydownHandler)
  }

  componentWillUnmount () {
    // this.props.layer.un('filter:change', this.moveHandler)
    document.removeEventListener('keydown', this.keydownHandler)
  }

  UNSAFE_componentWillReceiveProps (nextProps) { // eslint-disable-line camelcase
    if (nextProps.tabs.length) this.createDateTicks(nextProps.tabs[this.state.index])
  }

  createDateTicks = tab => {
    const dates = tab.dates
      .map(date => new Date(date)) /* we convert all dates to JS dates for easier use */
      .sort((a, b) => a - b) /* the sort must happen before the filter in order to remove dup dates */
      .filter((d, i, a) => datesDiffDay(a[i], a[i - 1])) /* this removes dup dates (precision is down to the day) */
    const firstDayOfFirstMonth = moment(dates[0]).startOf('month')

    this.setState({
      dates,
      tooManyDates: false,
      selectedDate: null,
      selectedDateRange: [],
      firstDayOfFirstMonth,
      numOfDays: moment(dates[dates.length - 1]).diff(moment(dates[0]), 'days', true)
    })
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
      const selectedDateRange = [leftDate, rightDate]

      this.setState({
        isMouseDown: false,
        selectedDateRange,
        selectedDate: null
      })
      this.props.onDatesChange({
        id: this.props.tabs[this.state.index].id,
        selectedDateRange
      })
    } else {
      const selectedDateRange = [dates[0], dates[dates.length - 1]]

      this.setState({ selectedDateRange })
      this.props.onDatesChange({
        id: this.props.tabs[this.state.index].id,
        selectedDateRange
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
    const selectedDateRange = []

    // if a single date is selected, you cannot also have a date range selected
    this.setState({
      selectedDate,
      selectedDateRange
    })
    this.props.onDatesChange({
      id: this.props.tabs[this.state.index].id,
      selectedDate,
      selectedDateRange
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
    const selectedDate = null
    const selectedDateRange = []

    this.setState({
      selectedDate,
      selectedDateRange,
      leftPosition: 0,
      rangeMin: 0,
      rangeMax: 0
    })
    this.props.onDatesChange({
      id: this.props.tabs[this.state.index].id,
      selectedDate,
      selectedDateRange
    })
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
  renderMarks = ({ dates, tickColor }) => {
    const { selectedDate } = this.state
    const padding = 24

    if (!this.markContainer) return
    const { width: containerWidth } = this.markContainer.getBoundingClientRect()

    const ticks = dates.map((date, i) => {
      const leftPosition = this.calculateLeftPlacement(date, 4, containerWidth, padding)

      return (
        <Tickmark
          key={i}
          selected={moment(dates[i]).isSame(selectedDate)}
          style={{ left: `${leftPosition}px` }}
          tickColor={tickColor}>
        </Tickmark>
      )
    })

    return ticks
  }

  onTabClicked = (_, index) => {
    this.setState({ index })
    this.props.onTabChange(index)
  }

  render () {
    const { tabs, translations } = this.props
    const {
      tooManyDates,
      dates,
      selectedDate,
      selectedDateRange,
      firstDayOfFirstMonth,
      rangeMin,
      rangeMax,
      index
    } = this.state

    return (
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <Typography component='div'>
          <Container>
            <Grid container justify='center'>
              <Card style={{ width: '100%', paddingTop: '4px' }}>
                <Tabs
                  style={{ marginRight: '60px' }}
                  indicatorColor='primary'
                  value={index}
                  onChange={this.onTabClicked}
                  aria-label='simple tabs example'
                  variant='scrollable'
                  scrollButtons='auto'>
                  {tabs.map((tab, i) => (
                    <Tab label={`Layer ${i + 1}`} key={i} />
                  ))}
                </Tabs>
                {tooManyDates ? (
                  <TooManyForPreview>{translations['_ol_kit_.TimeSliderBase.tooMany']}</TooManyForPreview>
                ) : (
                  tabs.map((tab, i) => (
                    <TabPanel value={index} index={index} key={i}>
                      <LayerTitle>{tab.title}</LayerTitle>
                      <DateContainer ref={node => { this.dateContainerDiv = node }}>
                        {this.renderLabels(dates, firstDayOfFirstMonth)}
                      </DateContainer>
                      <BarContainer
                        onMouseDown={this.handleMouseDown}
                        onMouseUp={this.handleMouseUp}
                        onMouseMove={this.handleMouseMove}
                        ref={node => { this.containerNode = node }}>
                        <TimesliderBar barPlacement={16} barHeight={2} />
                        <MarkContainer
                          ref={node => { this.markContainer = node }}>
                          {this.renderMarks(tab)}
                        </MarkContainer>
                        <HighlightedRange
                          style={{ display: rangeMin || rangeMax ? 'block' : 'none' }}
                          left={rangeMin}
                          right={rangeMax}
                          width={rangeMax - rangeMin}
                          ref={node => { this.highlightDiv = node }} />
                      </BarContainer>
                    </TabPanel>
                  ))
                )}
                <BottomContainer>
                  {translations['_ol_kit_.TimeSliderBase.dateRange'] || 'Date Range'}
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
                  {` ${translations['_ol_kit_.TimeSliderBase.to'] || 'To'} `}
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
                    {translations['_ol_kit_.TimeSliderBase.previous']}
                  </Button>
                  <Button disabled={datesSameDay(selectedDate, dates[dates.length - 1])} onClick={() => this.cycleDates('ArrowRight')} variant='contained' color='primary'>
                    {translations['_ol_kit_.TimeSliderBase.next']}
                  </Button>

                  <IconButton onClick={this.resetState}>
                    <SyncIcon color='primary' />
                  </IconButton>
                </BottomContainer>
                <IconButton onClick={this.props.onClose} style={{ position: 'absolute', top: '5px', right: '5px' }} aria-label='delete'>
                  <CloseIcon />
                </IconButton>
              </Card>
            </Grid>
          </Container>
        </Typography>
      </MuiPickersUtilsProvider>
    )
  }
}

TimeSliderBase.defaultProps = {
  onClose: () => {},
  onDatesChange: () => {},
  onTabChange: () => {}
}

TimeSliderBase.propTypes = {
  /** callback fired when TimeSliderBase 'x' is clicked  */
  onClose: PropTypes.func,
  /** callback fired when date selection or range is changed */
  onDatesChange: PropTypes.func,
  /** callback fired when a new tab is clicked */
  onTabChange: PropTypes.func,
  /** separates tabs + corresponding dates into groups */
  tabs: PropTypes.arrayOf(PropTypes.shape({
    dates: PropTypes.array,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    tickColor: PropTypes.string,
    title: PropTypes.string
  })),
  /** object with key/value pairs for translated strings */
  translations: PropTypes.shape({
    '_ol_kit_.TimeSliderBase.dateRange': PropTypes.string,
    '_ol_kit_.TimeSliderBase.next': PropTypes.string,
    '_ol_kit_.TimeSliderBase.previous': PropTypes.string,
    '_ol_kit_.TimeSliderBase.selectedEndDate': PropTypes.string,
    '_ol_kit_.TimeSliderBase.selectedStartDate': PropTypes.string,
    '_ol_kit_.TimeSliderBase.to': PropTypes.string,
    '_ol_kit_.TimeSliderBase.tooMany': PropTypes.string
  })
}

export default connectToMap(TimeSliderBase)
