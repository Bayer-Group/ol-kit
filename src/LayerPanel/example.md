The `LayerPanel` is a convenient way to view things that are on the map. The original intent is to view layers but with this `LayerPanel` you can view whatever you want. Build pages into the `LayerPanel` that will show up in their own tabs to make whatever customization you want. Another common page that works well with the `LayerPanel` is a Legends page which you can make with a `LayerPanelPage` component.

Its as simple as that. This will give you a `LayerPanel` placed on the right side of the screen that allows you to view the Layers from the map and toggle visibility/remove.
```jsx
<LayerPanel />
```
![image](https://github.platforms.engineering/storage/user/2990/files/cb487900-86d2-11ea-8a6c-587e8bb8377c)


If you want an easy way to add a second page use the `LayerPanelPage` component and give it an icon. We use `@material-ui/icons` most of the time, they work well. This gives you a second page that has it's own tab to toggle through.
```jsx
<LayerPanel>
  <LayerPanelPage tabIcon={<VpnKeyIcon />}>
    <LayerPanelContent>
      Legends Page
    </LayerPanelContent>
  </LayerPanelPage>
</LayerPanel>
```
![image](https://github.platforms.engineering/storage/user/2990/files/59702f80-86d2-11ea-8633-e35602cec3c5)


Use a `LayerPanelHeader` to get a nice header at the top. There are several props for the Header component. (title, avatar, and actions)
```jsx
<LayerPanel>
  <LayerPanelPage tabIcon={<VpnKeyIcon />}>
    <LayerPanelHeader title='Legends Page' />
    <LayerPanelContent>
      Place your legend images here...
    </LayerPanelContent>
  </LayerPanelPage>
</LayerPanel>
```
![image](https://github.platforms.engineering/storage/user/2990/files/0e0a5100-86d3-11ea-8e23-738dd4d92d57)


The `LayerPanelHeader` can be powerful. If you want actions in your header pass a `LayerPanelActions` component with the actions you want in it. We have built in actions in `ol-kit`. Check out the docs for all of them. In the example we're using `LayerPanelActionRemove` which is from `ol-kit` and the Update Legends `@material-ui/core/MenuItem` is custom. 
```jsx
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
      Place your legend images here...
    </LayerPanelContent>
  </LayerPanelPage>
</LayerPanel>
```
![image](https://github.platforms.engineering/storage/user/2990/files/76f1c900-86d3-11ea-9fd2-cfc39e019e36)


You can make a list by passing items down. Which should be an array. There's also a built in drag for the `LayerPanelListItem`. You can disable it buy passing the prop `disableDrag` to the `LayerPanelList`.
```jsx
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
      <LayerPanelList items={legends} />
    </LayerPanelContent>
  </LayerPanelPage>
</LayerPanel>
```
![image](https://github.platforms.engineering/storage/user/2990/files/cf28cb00-86d3-11ea-850b-a33275dd4c1c)

Below you can see how we add custom actions to our `LayerPanel` and also that you can render an array of `LayerPanelListItem`'s in your `LayerPanelList`. Also the list is draggable and has a callback to allow you to reorder the items however you want. Theres an `onSort` prop that receives a Javascript Sort function to customize the way the items get sorted.
```jsx
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

We also have a prebuilt page that ships with the `LayerPanel` called `LayerPanelLayersPage`. It's a simple drop in that allows you to customize things like handleFeatureDoubleClick of a list item and quite a few other props. Check out the docs on the `LayerPanelLayersPage` to see more of the props you can pass. You can either customize it by importing it yourself (which requires you to switch to the `LayerPanelBase` as the parent component) or you can pass the props of the `LayerPanelLayersPage` down through the prebuilt `LayerPanel`.
```jsx
// Passing the props through the LayerPanel component
<LayerPanel handleFeatureDoubleClick={this.onFeatureDoubleClick}>
  <LayerPanelPage tabIcon={<VpnKeyIcon />}>
    <LayerPanelHeader
      title='Legends Page'
      avatar={<VpnKeyIcon />} />
    <LayerPanelContent>
      Hello world
    </LayerPanelContent>
  </LayerPanelPage>
</LayerPanel>

// Directly pulling in the LayerPanelLayersPage and passing props through it
<LayerPanelBase>
  <LayerPanelLayersPage handleFeatureDoubleClick={this.onFeatureDoubleClick}>
  <LayerPanelPage tabIcon={<VpnKeyIcon />}>
    <LayerPanelHeader
      title='Legends Page'
      avatar={<VpnKeyIcon />} />
    <LayerPanelContent>
      Hello world
    </LayerPanelContent>
  </LayerPanelPage>
</LayerPanelBase>
```

To show you the amount of customization possible with these pages, here's the `LayerPanelListPage`.
```jsx
<LayerPanelPage>
  <LayerPanelHeader
    title={'Active Layers'}
    translations={translations}
    avatar={<LayerPanelCheckbox checkboxState={masterCheckboxVisibility} handleClick={this.setVisibilityForAllLayers} />}
    actions={customActions ||
      <LayerPanelActions
        icon={<MoreHorizIcon />}
        translations={translations}
        layers={layers}
        map={map}>
        <LayerPanelActionRemove
          removeFeaturesForLayer={this.removeFeaturesForLayer}
          shouldAllowLayerRemoval={shouldAllowLayerRemoval} />
        {onFileImport && <LayerPanelActionImport handleImport={onFileImport} />}
        {onExportFeatures && <LayerPanelActionExport onExportFeatures={onExportFeatures} />}
      </LayerPanelActions>} />
  {enableFilter &&
    <TextField
      id='feature-filter-input'
      label={'Filter Layers'}
      type='text'
      style={{ margin: '8px' }}
      fullWidth
      value={filterText}
      onChange={(e) => this.handleFilter(e.target.value)} />
  }
  <LayerPanelContent>
    <LayerPanelList disableDrag={disableDrag} onSort={this.zIndexSort} onReorderedItems={this.reorderLayers} items={layers} >
      {layerFilter(layers).filter((layer) => {
        const filteredFeatures = this.getFeaturesForLayer(layer)

        return !enableFilter || !(layer instanceof olLayerVector) ? true : filteredFeatures.length
      }).sort(this.zIndexSort).map((layer, i) => {
        const features = this.getFeaturesForLayer(layer)

        return (
          <div key={i}>
            <LayerPanelListItem handleDoubleClick={() => { handleLayerDoubleClick(layer) }}>
              {<LayerPanelCheckbox
                checkboxState={!layer ? null : layer.getVisible()}
                handleClick={(e) => this.handleVisibility(e, layer)} />}
              {<LayerPanelExpandableList show={!!features} open={expandedLayer} handleClick={this.handleExpandedLayer} />}
              <ListItemText primary={layer.get('title') || 'Untitled Layer'} />
              <ListItemSecondaryAction>
                <LayerPanelActions
                  icon={<MoreVertIcon />}
                  translations={translations}
                  layer={layer}
                  map={map} >
                  {getMenuItemsForLayer(layer) ||
                  [<LayerPanelActionRemove key='removeLayer' shouldAllowLayerRemoval={shouldAllowLayerRemoval} />,
                    <LayerPanelActionExtent key='gotoExtent' />,
                    <LayerPanelActionOpacity key='layerOpacity' />]}
                </LayerPanelActions>
              </ListItemSecondaryAction>
            </LayerPanelListItem>
            { features
              ? <Collapse in={expandedLayer} timeout='auto' unmountOnExit>
                <List component='div' disablePadding style={{ paddingLeft: '36px' }}>
                  {features.map((feature, i) => {
                    return (
                      <ListItem key={i} hanldeDoubleClick={() => handleFeatureDoubleClick(feature)}>
                        <LayerPanelCheckbox
                          handleClick={(event) => this.handleFeatureCheckbox(layer, feature, event)}
                          checkboxState={feature.get('_feature_visibility')} />
                        <ListItemText inset={false} primary={feature.get('name') || `Feature ${i}`} />
                      </ListItem>
                    )
                  })}
                </List>
              </Collapse> : null }
          </div>
        )
      })}
    </LayerPanelList>
  </LayerPanelContent>
</LayerPanelPage>
```










