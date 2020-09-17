import React from 'react'
import Button from '@material-ui/core/Button'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import { withRouter } from 'react-router-dom'

function SimpleSnackbar(props) {
  const [open, setOpen] = React.useState(true)
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setOpen(false)
  }
  let message = 'Welcome to ol-kit!'
  
  switch (props.location.pathname) {
    case '/covid':
      message = 'Covid-19 Demo! (case data from arcgis)'
      break;
    case '/space':
      message = 'Space Demo! (find the International Space Station)'
      break;
    case '/':
      message = 'Welcome ol-kit demo! Go explore the world 🌍'
      break;
    default:
      break;
  }

  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        severity="info"
        open={open}
        onClose={handleClose}
        message={message}
        action={
          <React.Fragment>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
    </div>
  )
}

export default withRouter(SimpleSnackbar)