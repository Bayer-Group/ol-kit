import React, { Component } from 'react'

import List from '@material-ui/core/List'
import LayerPanelListItem from 'LayerPanel/LayerPanelListItem'
import nanoid from 'nanoid'

import PropTypes from 'prop-types'

const applyDrag = (arr, dragResult) => {
  const { removedIndex, addedIndex, payload } = dragResult

  if (removedIndex === null && addedIndex === null) return arr

  const result = [...arr]

  let itemToAdd = payload

  if (removedIndex !== null) {
    itemToAdd = result.splice(removedIndex, 1)[0]
  }

  if (addedIndex !== null) {
    result.splice(addedIndex, 0, itemToAdd)
  }

  return result
}

/**
 * @component
 * @category LayerPanel
 * @since 0.5.0
 */
class LayerPanelList extends Component {
  handleDrop = e => {
    const { onSort, onReorderedItems, items, onLayerReorder } = this.props
    const reorderedItems = applyDrag(items.sort(onSort), e)

    if (onReorderedItems) {
      onReorderedItems(reorderedItems)
      onLayerReorder()
    }
  }

  onDragOver = e => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    let dropNode = e.target

    do {
      if (dropNode.className === 'dropzone') {
        this.displaced = dropNode.firstChild
        this.dragTarget.parentNode.replaceChild(dropNode.firstChild, this.dragTarget)
        dropNode.appendChild(this.dragTarget)

        break
      }
    }
    while (dropNode = dropNode.parentNode, (dropNode.id !== '_ol_kit_layer_panel_drag_container' && dropNode.id !== this.dragTarget.id))
  }

  onDragStart = e => {
    e.dataTransfer.dropEffect = 'move'
    this.dragTarget = e.target
    e.target.style.opacity = '0.25'
  }

  onDragEnd = e => {
    e.preventDefault()
    let dropNode = e.target

    do {
      if (dropNode.className === 'draggable') {
        const removedIndex = this.dragTarget.id.split('_')[0]
        const addedIndex = this.displaced.id.split('_')[0]
        const payload = this.dragTarget

        console.log('addedindex', addedIndex)
        console.log('removedIndex', removedIndex)

        this.handleDrop({ ...e, removedIndex, addedIndex, payload })

        break
      }
    }
    while (dropNode = dropNode.parentNode, dropNode.id !== '_ol_kit_layer_panel_drag_container')

    this.dragTarget.style.opacity = '1'
  }

  render () {
    const { children, disableDrag, items } = this.props

    if (children) {
      return (
        <List>
          <div id='_ol_kit_layer_panel_drag_container' onDragEnd={this.onDragEnd}>
            {React.Children.map(this.props.children, (child, i) => {
              const id = `${i}_${nanoid(6)}`

              return (
                <div className={'dropzone'} onDragOver={this.onDragOver} key={id || child.id}>
                  <div id={id} className={'draggable'} draggable={disableDrag ? false : true} onDragStart={this.onDragStart}>{child}</div>
                </div>
              )
            })}
          </div>
        </List>
      )
    } else if (items) {
      return (
        <List>
          <div id='_ol_kit_layer_panel_drag_container' onDragEnd={this.onDragEnd}>
            {items.map((item, i) => {
              const id = `${i}_${nanoid(6)}`

              return (
                <div className={'dropzone'} onDragOver={this.onDragOver} key={item}>
                  <div id={id} className={'draggable'} draggable={disableDrag ? false : true} onDragStart={this.onDragStart}>
                    <LayerPanelListItem>{item}</LayerPanelListItem>
                  </div>
                </div>
              )
            }
            )}
          </div>
        </List>
      )
    } else {
      return <div>Must either pass `children` or a prop of `items` for LayerPanelList to render its list</div>
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
  disableDrag: PropTypes.bool,

  /** A callback function to inform when the list is reordered */
  onLayerReorder: PropTypes.func
}

LayerPanelList.defaultProps = {
  onSort: (a, b) => { return a - b },
  disableDrag: false,
  onLayerReorder: () => {}
}

export default LayerPanelList
