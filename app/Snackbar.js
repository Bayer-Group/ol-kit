import React from 'react'
import Button from '@material-ui/core/Button'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import githubLogo from './images/githubLogo.png'

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
      message = 'Covid-19 Demo! (Case data from ArcGIS)'
      break;
    case '/space':
      message = 'Space Demo! (Find the International Space Station!)'
      break;
    case '/geohack':
      message = 'GeoHack 2020 Winner Demo! Checkout COVID Tweets!'
      break;
    case '/':
      message = 'Welcome to the ol-kit demo! Go explore the world 🌍'
      break;
    default:
      break;
  }

  const linkSourceCode = () => {
    let url = 'https://github.com/MonsantoCo/ol-kit/'
    switch (props.location.pathname) {
      case '/covid':
        url = 'https://github.com/MonsantoCo/ol-kit/tree/master/app/demos/covid'
        window.open(url, '_blank')
        break;
      case '/space':
        url = 'https://github.com/MonsantoCo/ol-kit/tree/master/app/demos/space'
        window.open(url, '_blank')
        break;
      case '/geohack':
        url = 'https://github.com/MonsantoCo/ol-kit/tree/master/app/demos/geohack'
        window.open(url, '_blank')
        break;
      case '/':
        url = 'https://github.com/MonsantoCo/ol-kit/tree/master/app/demos/world'
        window.open(url, '_blank')
        break;
      default:
        break;
    }
  }

  const SnackbarImg = styled.img`
    width: 40px;
  `

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
            <IconButton size="small" aria-label="Source Code" color="inherit" onClick={linkSourceCode} style={{fontSize: '0.9rem'}}>
              <SnackbarImg src={githubLogo} title="Source Code Link" />
            </IconButton>
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