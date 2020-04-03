import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Flex, TabButton, TabList, TabsContainer, TabSlider } from './styled'

/**
 * @component
 * @category vmc
 * @example ./example.md
 */
class PopupTabs extends Component {
  constructor (props) {
    super(props)

    this.state = {
      selectedIdx: props.selectedIdx
    }
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps ({ selectedIdx }) {
    if (selectedIdx !== this.props.selectedIdx) this.setState({ selectedIdx })
  }

  onChange (i) {
    this.setState({ selectedIdx: i })

    if (this.props.onChange) this.props.onChange(i)
  }

  render () {
    const { children } = this.props
    const { selectedIdx } = this.state

    return (
      <TabsContainer>
        <TabList>
          <Flex>
            {React.Children.map(children, (child, i) => {
              return (<TabButton
                key={child.props.title}
                onClick={this.onChange.bind(this, i)}
                selected={selectedIdx === i}>
                {child.props.title}
                {selectedIdx === i ? <TabSlider /> : null}
              </TabButton>)
            })}
          </Flex>
        </TabList>
        <div>
          {React.Children.toArray(children)[selectedIdx]}
        </div>
      </TabsContainer>
    )
  }
}

PopupTabs.propTypes = {
  /** Callback fired when the tabs change passed the index of the new tab being shown */
  onChange: PropTypes.func,

  /** The content to display in the tab */
  children: PropTypes.node.isRequired,

  /** The index of the currently shown popup */
  selectedIdx: PropTypes.number
}

PopupTabs.defaultProps = {
  selectedIdx: 0
}

export default PopupTabs
