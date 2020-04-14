import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import MaterialPopover from '@material-ui/core/Popover'
import { withStyles } from '@material-ui/core/styles'

/**
 * @component
 * @category vmc
 */
const Popover = withStyles(() => ({
  paper: {
    overflowX: 'visible',
    overflowY: 'visible'
  }
}))(MaterialPopover)

/**
 * @component
 * @category vmc
 */
class PopoverBuilder extends React.Component {
  constructor () {
    super()

    this.state = {
      open: false
    }
  }

  handleClickButton = () => {
    this.setState({ open: true })
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  render () {
    const { open } = this.state
    const { children, disabled, title } = this.props

    return (
      <React.Fragment>
        <Button
          disabled={disabled}
          buttonRef={node => {
            this.anchorEl = node
          }}
          variant='contained'
          onClick={this.handleClickButton}>
          {title}
        </Button>
        <Popover
          open={open}
          onClose={this.handleClose}
          anchorEl={this.anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left'
          }}>
          {children}
        </Popover>
      </React.Fragment>
    )
  }
}

PopoverBuilder.propTypes = {
  /** Children to be shown inside the popover when open */
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),

  /** If true the popover button will be disabled */
  disabled: PropTypes.bool,

  /** Title to show in the button which triggers the popover */
  title: PropTypes.string
}

export default PopoverBuilder
