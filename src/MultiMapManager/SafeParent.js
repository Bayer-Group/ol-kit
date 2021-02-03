import React from 'react'
import PropTypes from 'prop-types'
import ugh from 'ugh'

export default class SafeParent extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      parentContextKey: null
    }

    this.ref = React.createRef()
  }

  componentDidMount () {
    const { Component, providerProps } = this.props
    const keys = Object.keys(providerProps)

    console.log('DID MOUNT safeParent', keys, this.ref)

    if (this.ref.current) {
      const parentContextKey = keys.find(key => {
        const parentMap = this.ref.current.closest(`#${key}`)
        
        console.log('parentMap', parentMap)
        return parentMap?.id
      })

      if (!parentContextKey) ugh.error(`Could not find parent <Map> for ${Component.name} during context lookup`)

      this.setState({ parentContextKey })
    }
  }

  render () {
    const { Component, inlineProps, providerProps } = this.props
    const { parentContextKey } = this.state
    const contextKey = inlineProps._ol_kit_context_id || parentContextKey
    const relativeProviderProps = providerProps[contextKey]
    const filteredProviderProps = { ...relativeProviderProps }

    if (Component.propTypes) {
      // filter out any props from context that do not need to get passed to this wrapped component
      Object.keys(providerProps).forEach(key => {
        if (!propTypes[key]) delete filteredProviderProps[key]
      })
    }

    return (
      !!contextKey ? (
        <Component {...filteredProviderProps} {...inlineProps} />
      ):(
        <div ref={this.ref}>{`Could not find parent <Map> for ${Component.name} during context lookup`}</div>
      )
    )
  }
}