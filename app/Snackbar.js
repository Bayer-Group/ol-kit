import React from 'react'
import Button from '@material-ui/core/Button'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'

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
        url = 'https://github.com/MonsantoCo/ol-kit/tree/master/app/routes/covid'
        window.open(url, '_blank')
        break;
      case '/space':
        url = 'https://github.com/MonsantoCo/ol-kit/tree/master/app/routes/space'
        window.open(url, '_blank')
        break;
      case '/':
        url = 'https://github.com/MonsantoCo/ol-kit/tree/master/app/routes/demo'
        window.open(url, '_blank')
        break;
      default:
        break;
    }
  }

  const SnackbarImg = styled.img`
    height: 40px;
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
              <SnackbarImg src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/217d5ea0-623d-40b1-9b31-027b904a5f15/dccuk5k-9eee2a52-9684-4023-ae06-ae13c46c5d08.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvMjE3ZDVlYTAtNjIzZC00MGIxLTliMzEtMDI3YjkwNGE1ZjE1XC9kY2N1azVrLTllZWUyYTUyLTk2ODQtNDAyMy1hZTA2LWFlMTNjNDZjNWQwOC5wbmcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ.B2xmnrPQ4PGVoYAil-PAPV8CKR-fAIcIo4IlC6xHtU0" title="Source Code Link" />
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