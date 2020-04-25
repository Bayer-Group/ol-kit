import React, { Component } from 'react'

import List from '@material-ui/core/List'
import LayerPanelListItem from 'LayerPanel/LayerPanelListItem'
import { Container, Draggable } from 'react-smooth-dnd'

import PropTypes from 'prop-types'

const applyDrag = (arr, dragResult) => {
  const { removedIndex, addedIndex, payload } = dragResult

  if (removedIndex === null && addedIndex === null) return arr

  const result = [...arr]

  let layerToAdd = payload

  if (removedIndex !== null) {
    layerToAdd = result.splice(removedIndex, 1)[0]
  }

  if (addedIndex !== null) {
    result.splice(addedIndex, 0, layerToAdd)
  }

  return result
}

/**
 * @component
 * @category vmc
 */
class LayerPanelList extends Component {
  constructor (props) {
    super(props)

    this.state = {
      items: props.items
    }
  }

  componentDidUpdate (prevProps) {
    if (prevProps.items[0] !== this.props.items[0]) {
      console.log(prevProps)
      this.setState({ items: this.props.items })
    }
  }

  makeChildrenSafe = children => {
    // if children is an array return children if its defined but not an array wrap it otherwise return null
    return Array.isArray(children) ? children : children ? [children] : null // eslint-disable-line
  }

  onDrop = e => {
    const { onSort, onReorderedItems } = this.props
    const { items } = this.state
    const reorderedItems = applyDrag(items.sort(onSort), e)

    if (onReorderedItems) {
      onReorderedItems(reorderedItems)
    } else {
      this.setState({ items: reorderedItems })
    }
  }

  render () {
    const { children, disableDrag } = this.props
    const { items } = this.state
    const ItemContainer = disableDrag ? 'div' : Draggable

    if (children) {
      return (
        <List>
          <Container onDrop={this.onDrop}>
            {React.Children.map(this.props.children, child => <ItemContainer key={child.id}>{child}</ItemContainer>)}
          </Container>
        </List>
      )
    } else if (items) {
      return (
        <List>
          <Container onDrop={this.onDrop} >
            {items.map(item => (
              <ItemContainer key={item}>
                <LayerPanelListItem>{item}</LayerPanelListItem>
              </ItemContainer>
            )
            )}
          </Container>
        </List>
      )
    } else {
      return <div style='color:red;'>Must either pass `children` or a prop of `items` for LayerPanelList to render its list</div>
    }
  }
}

LayerPanelList.propTypes = {
  /** The content of the LayerPanelList (likely `LayerPanelListItem` components) */
  children: PropTypes.node,
  /** callback when item prop is dropped */
  onSort: PropTypes.func,
  /** callback with reordered items */
  onReorderedItems: PropTypes.func,
  /** array of items to be rendered in the list */
  items: PropTypes.array,

  /** A boolean to disable the drag event on the LayerPanelList */
  disableDrag: PropTypes.bool
}

LayerPanelList.defaultProps = {
  onSort: (a, b) => { return a - b },
  disableDrag: false
}

export default LayerPanelList
