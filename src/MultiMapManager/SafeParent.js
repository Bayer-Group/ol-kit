import React from 'react'
import PropTypes from 'prop-types'
import ugh from 'ugh'

/* A higher order component that manages MultiMapContext for connectToContext wrapped children
 * @component
 * @category MultiMap
 * @since 1.7.0
 */
export default class SafeParent extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      parentContextKey: null
    }

    this.ref = React.createRef()
  }

  contextKeyLookup () {
    const { Component, providerProps } = this.props
    const keys = Object.keys(providerProps)
    const { current } = this.ref

    if (current) {
      const parentContextKey = keys.find(key => current.closest(`#${key}`) || current.closest(`#${key} ~ *`))

      if (!parentContextKey) ugh.error(`Could not find parent <Map> for ${Component.name} during context lookup (tip: make sure portals render as children of their map.getTarget() parent)`) // eslint-disable-line max-len

      this.setState({ parentContextKey })
    }
  }

  componentDidMount () {
    this.contextKeyLookup()
  }

  render () {
    const { Component, inlineProps, providerProps } = this.props
    const { parentContextKey } = this.state
    const contextKey = inlineProps._ol_kit_context_id || parentContextKey
    const relativeProviderProps = providerProps[contextKey]
    const filteredProviderProps = { ...relativeProviderProps, ref: this.ref }

    if (Component.propTypes) {
      // filter out any props from context that do not need to get passed to this wrapped component
      Object.keys(providerProps).forEach(key => {
        if (!Component.propTypes[key]) delete filteredProviderProps[key]
      })
    }

    return (
      contextKey ? (
        <Component {...filteredProviderProps} {...inlineProps} />
      ) : (
        <div ref={this.ref}>{`Could not find parent <Map> for ${Component.name} during context lookup`}</div>
      )
    )
  }
}

SafeParent.propTypes = {
  /** the Component being wrapped and returned */
  Component: PropTypes.node.isRequired,
  /** original props provided directly to the Component- these always take precedence */
  inlineProps: PropTypes.Object,
  /** props provided from React context (set in the MultiMapManager and passed down) */
  providerProps: PropTypes.Object
}
