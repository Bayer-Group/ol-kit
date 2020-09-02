You can make a list by passing items down. Which should be an array. There's also a built in drag for the `LayerPanelListItem`. You can disable it buy passing the prop `disableDrag` to the `LayerPanelList`. If you want to persist the reorder of items then you'll need to pass the onReorderedItems callback to the `LayerPanelList` and update the items in your parent component.
```jsx
import {
  LayerPanel,
  LayerPanelPage,
  LayerPanelHeader,
  LayerPanelContent,
  LayerPanelActions,
  LayerPanelActionRemove,
  LayerPanelList } from '@bayer/ol-kit'
import VpnKeyIcon from '@material-ui/icons/VpnKeyIcon'
import MoreHorizIcon from '@material-ui/icons/MoreHorizIcon'
import MenuItem from '@material-ui/core/MenuItem'

return (
  <LayerPanel>
    <LayerPanelPage tabIcon={<VpnKeyIcon />}>
      <LayerPanelHeader
        title='Legends Page'
        avatar={<VpnKeyIcon />}
        actions={
          <LayerPanelActions icon={<MoreHorizIcon />}>
            <LayerPanelActionRemove />
            <MenuItem onClick={this.updateLegends}>Update Legends</MenuItem>
            <MenuItem onClick={this.setLegendsToOriginalOrder}>Original Order Legends</MenuItem>
          </LayerPanelActions>
        } />
      <LayerPanelContent>
        <LayerPanelList items={legends} onReorderedItems={this.handleReorderedItems} />
      </LayerPanelContent>
    </LayerPanelPage>
  </LayerPanel>
)
```
![image](https://github.platforms.engineering/storage/user/2990/files/cf28cb00-86d3-11ea-850b-a33275dd4c1c)

Below you can see how we add custom actions to our `LayerPanel` and also that you can render an array of `LayerPanelListItem`'s in your `LayerPanelList`. Also the list is draggable and has a callback to allow you to reorder the items however you want. Theres an `onSort` prop that receives a Javascript Sort function to customize the way the items get sorted.
```jsx
import {
  LayerPanel,
  LayerPanelPage,
  LayerPanelHeader,
  LayerPanelContent,
  LayerPanelActions,
  LayerPanelActionRemove,
  LayerPanelList } from '@bayer/ol-kit'
import VpnKeyIcon from '@material-ui/icons/VpnKeyIcon'
import MoreHorizIcon from '@material-ui/icons/MoreHorizIcon'
import MenuItem from '@material-ui/core/MenuItem'

class MyCustomLayerPanelContainer extends React.Component {
  constructor (props) {
    super(props)

    this.state = { legends: ['First Legend', 'Second Legend', 'Third Legend'] }

    this.updateLegends = this.updateLegends.bind(this)
    this.handleReorderedItems = this.handleReorderedItems.bind(this)
  }

  updateLegends () {
    console.log('updated my legends')
  }

  handleReorderedItems (newItems) {
    this.setState({ legends: newItems })
  }

  render () {
    const { maps } = this.props
    const { legends } = this.state

    return (
      <LayerPanel>
        <LayerPanelPage tabIcon={<VpnKeyIcon />}>
          <LayerPanelHeader
            title='Legends Page'
            avatar={<VpnKeyIcon />}
            actions={
              <LayerPanelActions icon={<MoreHorizIcon />}>
                <LayerPanelActionRemove />
                <MenuItem onClick={this.updateLegends}>Update Legends</MenuItem>
              </LayerPanelActions>
            } />
          <LayerPanelContent>
            <LayerPanelList items={legends} onReorderedItems={this.handleReorderedItems}>
              {legends.map(legend => {
                return <LayerPanelListItem>{legend}</LayerPanelListItem>
              })}
            </LayerPanelList>
          </LayerPanelContent>
        </LayerPanelPage>
      </LayerPanel>
    )
  }
}
```