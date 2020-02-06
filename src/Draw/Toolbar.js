import React from 'react'
import PropTypes from 'prop-types'
import Toolbar from '../Toolbar'
import { StyledButton } from './styled'

export class DrawToolbar extends React.Component {
  render () {
    const { translations, onCancel, onFinish } = this.props

    return (
      <Toolbar>
        <StyledButton color='secondary' onClick={onCancel}>
          {translations['olKit.DrawToolbar.cancel']}
        </StyledButton>
        <StyledButton color='primary' onClick={onFinish}>
          {translations['olKit.DrawToolbar.finish']}
        </StyledButton>
      </Toolbar>
    )
  }
}

DrawToolbar.propTypes = {
  onCancel: PropTypes.func,
  onFinish: PropTypes.func,
  translations: PropTypes.object
}

DrawToolbar.defaultProps = {
  translations: {
    'olKit.DrawToolbar.cancel': 'Cancel',
    'olKit.DrawToolbar.finish': 'Finish'
  }
}

export default DrawToolbar
