import React from 'react'
import ugh from 'ugh'
import { ProviderContext } from 'Provider'
import { MultiMapContext, SafeParent } from 'MultiMapManager'

/**
 * A wrapper utility function designed to automatically pass down provider conntext as props from the Provider component
 * @function
 * @category Provider
 * @since 1.0.0
 * @param {Component} component - A React component you want wrapped
 * @returns {Component} A wrapped React component which will automatically be passed a reference to provider context
 */
export function connectToContext (Component) {
  if (!Component) return ugh.throw('Pass a React component to \'connectToContext\'')

  return props => { // eslint-disable-line react/display-name

    // if no context exists, just render the component with inline props
    if (!MultiMapContext && !ProviderContext) return <Component {...props} />
    
    // multimap context will take precedence over the provider context
    return !!MultiMapContext
      ? (
        <MultiMapContext.Consumer>
          {
            (providerProps = {}) => {
              console.log('CONTEXT', providerProps)
              return (
                <SafeParent
                  inlineProps={props}
                  providerProps={providerProps}
                  Component={Component} />
              )
            }
          }
        </MultiMapContext.Consumer>
      ):(
        <ProviderContext.Consumer>
          {
            (providerProps = {}) => {
              // if propTypes is not defined on the component just pass all providerProps
              const filteredProviderProps = { ...providerProps }
              const { propTypes } = Component

              if (propTypes) {
                // filter out any props that do not need to get passed to this wrapped component
                Object.keys(providerProps).forEach(key => {
                  if (!propTypes[key]) delete filteredProviderProps[key]
                })
              }

              // // persistedState logic
              // const { persistedState, persistState } = providerProps
              // // set the key to look up component's persisted state
              // const persistedStateKey = props.persistedStateKey || Component.displayName || Component.name // eslint-disable-line react/prop-types

              return (
                <Component
                  // persistedState={persistedState[persistedStateKey]} // note: persistedState is undefined if persistedStateKey key doesn't exist yet (components should check for this)
                  // persistState={persistState}
                  {...filteredProviderProps}
                  {...props} />
              )
            }
          }
        </ProviderContext.Consumer>
      )
  }
}
