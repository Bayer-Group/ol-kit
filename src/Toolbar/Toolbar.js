import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { Grid } from '@material-ui/core'
import { Container } from './styled'

class Toolbar extends React.Component {
  render () {
    const { children } = this.props

    return ReactDOM.createPortal(
      <Container>
        <Grid container justifyContent='center' alignItems='center'>
          {children}
        </Grid>
      </Container>,
      document.body
    )
  }
}

Toolbar.propTypes = {
  /** The content of the toolbar */
  children: PropTypes.node.isRequired
}

export default Toolbar
