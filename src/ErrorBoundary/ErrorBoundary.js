import React from 'react'
import PropTypes from 'prop-types'
import { Button, Container, FloatingBackground, Header, Message } from './styled'
import MappyConcerned from './mappy_concerned.svg'
import MappyDead from './mappy_dead.svg'

/**
 * React ErrorBoundary component
 * @component
 */
class ErrorBoundary extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      abandonAllHope: false,
      attemptedReset: false,
      hasError: false
    }
  }

  componentDidCatch () {
    const { attemptedReset } = this.state

    if (attemptedReset) {
      // don't try to reset state after attemptedReset
      this.setState({ abandonAllHope: true })
    }
  }

  componentDidUpdate (prevProps, prevState) {
    const { abandonAllHope, attemptedReset, hasError } = this.state

    // reset the attemptedReset bool whenever successful reset occurs so next error can also be reset instead of abandoned
    if (prevState.hasError && !prevState.attemptedReset && !abandonAllHope && attemptedReset && !hasError) {
      this.setState({ attemptedReset: false })
    }
  }

  static getDerivedStateFromError (error) { // eslint-disable-line handle-callback-err
    return { hasError: true }
  }

  render () {
    const { abandonAllHope, hasError } = this.state
    const { floating } = this.props

    return hasError
      ? (
        <FloatingBackground floating={floating}>
          <Container floating={floating}>
            <Header>Something went wrong!</Header>
            {!abandonAllHope
              ? <MappyConcerned />
              : <MappyDead />}
            <Message>{!abandonAllHope
              ? 'Have another go?'
              : 'This component is beyond recovery...'}
            </Message>
            {!abandonAllHope
              ? <Button onClick={() => this.setState({ attemptedReset: true, hasError: false })}>Try Again</Button>
              : null}
          </Container>
        </FloatingBackground>
      ) : this.props.children
  }
}

ErrorBoundary.propTypes = {
  /** pass components as children of ErrorBoundary which are rendered if there is no error */
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  /** display error boundary with a modal-like background */
  floating: PropTypes.bool
}

export default ErrorBoundary
