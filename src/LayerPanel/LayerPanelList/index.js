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
    console.log('drop', e)
    const { onSort, onReorderedItems, items } = this.props
    const reorderedItems = applyDrag(items.sort(onSort), e)

    if (onReorderedItems) {
      onReorderedItems(reorderedItems)
    }
  }

  onDrop = e => {
    e.preventDefault()
    e.dataTransfer.getData('application/ol-kit')

    // console.log(e.target) // eslint-disable-line no-console
    // console.log(e.dataTransfer.getData('application/ol-kit')) // eslint-disable-line no-console
    // console.log(document.getElementById(e.dataTransfer.getData('application/ol-kit'))) // eslint-disable-line no-console

    let dropNode = e.target

    do {
      if (dropNode.className === 'draggable') {
        console.log(dropNode) // eslint-disable-line no-console

        const removedIndex = dropNode.id[0]
        const payload = document.getElementById(e.dataTransfer.getData('application/ol-kit'))
        const addedIndex = payload.id[0]

        this.handleDrop({ ...e, removedIndex, addedIndex, payload })

        break
      }
    }
    while (dropNode = dropNode.parentNode, dropNode.id !== 'dragContainer')

  }

  onDragOver = e => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    let dropNode = e.target

    do {
      if (dropNode.className === 'dropzone') {

        this.dragTarget.parentNode.replaceChild(dropNode.firstChild, this.dragTarget)
        dropNode.appendChild(this.dragTarget)

        break
      }
    }
    while (dropNode = dropNode.parentNode, dropNode.id !== 'dragContainer')
  }

  onDragStart = e => {
    e.dataTransfer.dropEffect = 'move'
    console.log(e.target) // eslint-disable-line no-console
    e.dataTransfer.setData('application/ol-kit', e.target.id)
    this.dragTarget = e.target
  }

  render () {
    const { children, disableDrag, items } = this.props
    // const ItemContainer = disableDrag ? 'div' : Draggable

    if (children) {
      return (
        <List>
          <div id='dragContainer'>
            {React.Children.map(this.props.children, (child, i) => {
              const id = `${i}${nanoid(6)}`

              return (
                <div className={`dropzone`} onDrop={this.onDrop} onDragOver={this.onDragOver} key={id || child.id}>
                  <div id={id} className={'draggable'} draggable={disableDrag ? 'false' : 'true'} onDragStart={this.onDragStart}>{child}</div>
                </div>
              )
            })}
          </div>
        </List>
      )
    } else if (items) {
      return (
        <List>
          <div id='dragContainer'>
            {items.map((item, i) => {
              const id = `${i}${nanoid(6)}`

              return (
                <div className={`dropzone`} onDrop={this.onDrop} onDragOver={this.onDragOver} key={item}>
                  <div id={id} className={'draggable'} draggable={disableDrag ? 'false' : 'true'} onDragStart={this.onDragStart}>
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
  disableDrag: PropTypes.bool
}

LayerPanelList.defaultProps = {
  onSort: (a, b) => { return a - b },
  disableDrag: false
}

export default LayerPanelList
