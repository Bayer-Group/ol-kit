import React from 'react'
import PropTypes from 'prop-types'
import ugh from 'ugh'

// adding a ** to next line will add this docs when ready
/* A higher order component that manages MultiMapContext for connectToContext wrapped children
 * @component
 * @category MultiMap
 * @since 1.7.0
 */
export default class SafeParent extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      parentContextKey: null,
      parentLookupAttempted: false
    }

    this.ref = React.createRef()
  }

  contextKeyLookup () {
    const { Component, providerProps } = this.props
    const keys = Object.keys(providerProps)
    const { current } = this.ref

    if (current && !Component.isMultiMap) {
      const parentContextKey = keys.find(key => current.closest(`#${key}`) || current.closest(`#${key} ~ *`)) // search the dom, starting at the placeholder ref created in the initial render and moving up; searching first for the map div itself and then siblings of the map div to handle how the <Map> component currently handles children.

      this.setState({ parentContextKey, parentLookupAttempted: true })
    } else if (current && Component.isMultiMap) {
      this.setState({ parentLookupAttempted: true })
    } else {
      this.setState({ parentLookupAttempted: true })
    }
  }

  componentDidMount () {
    this.contextKeyLookup()
  }

  render () {
    const { Component, defaultProps, explicitProps, providerProps } = this.props
    const { parentContextKey, parentLookupAttempted } = this.state
    const contextKey = explicitProps._ol_kit_context_id || parentContextKey
    const filteredProviderProps = { ...providerProps, ...providerProps[contextKey] } // always pass all props in context, then override with specific map context

    if (Component.propTypes) {
      // filter out any props from context that do not need to get passed to this wrapped component
      Object.keys(providerProps).forEach(key => {
        if (!Component.propTypes[key]) delete filteredProviderProps[key]
      })
    }

    return (
      parentLookupAttempted ? (
        <Component {...defaultProps} {...filteredProviderProps} {...explicitProps} />
      ) : (
        <div ref={this.ref}>{`Could not find parent <Map> for component: "${Component.name}" during context lookup`}</div>
      )
    )
  }
}

SafeParent.propTypes = {
  /** the Component being wrapped and returned */
  Component: PropTypes.node.isRequired,
  /** defaultProps from the Component that need to get spread first (to be overwritten) */
  defaultProps: PropTypes.object,
  /** original props provided directly to the Component- these always take precedence */
  explicitProps: PropTypes.object,
  /** props provided from React context (set in the MultiMapManager and passed down) */
  providerProps: PropTypes.object
}
