Use a `LayerPanelHeader` to get a nice header at the top. There are several props for the Header component. (title, avatar, and actions)
```jsx
return (
  <LayerPanel>
    <LayerPanelPage tabIcon={<VpnKeyIcon />}>
      <LayerPanelHeader title='Legends Page' />
      <LayerPanelContent>
        Place your legend images here...
      </LayerPanelContent>
    </LayerPanelPage>
  </LayerPanel>
)
```
![image](https://github.platforms.engineering/storage/user/2990/files/0e0a5100-86d3-11ea-8e23-738dd4d92d57)

The `LayerPanelHeader` can be powerful. If you want actions in your header pass a `LayerPanelActions` component with the actions you want in it. We have built in actions in `ol-kit`. Check out the docs for all of them. In the example we're using `LayerPanelActionRemove` which is from `ol-kit` and the Update Legends `@material-ui/core/MenuItem` is custom. 
```jsx
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
        Place your legend images here...
      </LayerPanelContent>
    </LayerPanelPage>
  </LayerPanel>
)
```
![image](https://github.platforms.engineering/storage/user/2990/files/76f1c900-86d3-11ea-9fd2-cfc39e019e36)