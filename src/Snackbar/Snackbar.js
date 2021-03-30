import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import MaterialSnackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'

import { amber, green, grey } from '@material-ui/core/colors'
import { makeStyles } from '@material-ui/core/styles'

const useWrapperStyles = makeStyles((theme) => ({
  success: {
    backgroundColor: green[600]
  },
  error: {
    backgroundColor: theme.palette.error.dark
  },
  info: {
    backgroundColor: grey[800]
  },
  warning: {
    backgroundColor: amber[700]
  },
  icon: {
    fontSize: 20
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1)
  },
  message: {
    display: 'flex',
    alignItems: 'center'
  }
}))

function SnackbarContentWrapper (props) {
  const classes = useWrapperStyles()
  const {
    className,
    message,
    variant,
    ...other
  } = props

  return (
    <SnackbarContent
      className={clsx(classes[variant], className)}
      aria-describedby='client-snackbar'
      message={
        <span id='client-snackbar' className={classes.message}>
          {message}
        </span>
      }
      {...other}
    />
  )
}

SnackbarContentWrapper.propTypes = {
  className: PropTypes.string,
  message: PropTypes.string,
  variant: PropTypes.oneOf(['error', 'info', 'success', 'warning']).isRequired
}

const useSnackbarStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1)
  }
}))

export default function Snackbar (props) {
  const { open, closeSnackbar, variant, message, duration } = props

  const classes = useSnackbarStyles()

  function handleClose (event, reason) {
    if (reason === 'clickaway') {
      return
    }

    closeSnackbar()
  }

  return ReactDOM.createPortal(
    <MaterialSnackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left'
      }}
      open={open}
      autoHideDuration={duration}
      onClose={handleClose}
      style={{ left: '8px', bottom: '8px' }}
    >
      <SnackbarContentWrapper
        onClose={handleClose}
        variant={variant}
        message={message}
        className={classes.margin}
      />
    </MaterialSnackbar>,
    document.body
  )
}

Snackbar.defaultProps = {
  open: false,
  duration: 6000,
  variant: 'info',
  message: ''
}

Snackbar.propTypes = {
  closeSnackbar: PropTypes.func.isRequired,
  open: PropTypes.bool,
  duration: PropTypes.number,
  variant: PropTypes.oneOf(['error', 'info', 'success', 'warning']),
  message: PropTypes.string
}
