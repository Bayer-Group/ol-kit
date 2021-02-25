The `LayerPanel` is a convenient way to view things that are on the map. The original intent is to view layers but with this `LayerPanel` you can view whatever you want. Build pages into the `LayerPanel` that will show up in their own tabs to make whatever customization you want. Another common page that works well with the `LayerPanel` is a Legends page which you can make with a `LayerPanelPage` component.

Its as simple as that. This will give you a `LayerPanel` placed on the right side of the screen that allows you to view the Layers from the map and toggle visibility/remove.
```jsx
import { LayerPanel } from '@bayer/ol-kit'

return <LayerPanel />
```
![image](https://github.platforms.engineering/storage/user/2990/files/cb487900-86d2-11ea-8a6c-587e8bb8377c)

We also have a prebuilt page that ships with the `LayerPanel` called `LayerPanelLayersPage`. It's a simple drop in that allows you to customize things like handleFeatureDoubleClick of a list item and quite a few other props. Check out the docs on the `LayerPanelLayersPage` to see more of the props you can pass. You can either customize it by importing it yourself (which requires you to switch to the `LayerPanelBase` as the parent component) or you can pass the props of the `LayerPanelLayersPage` down through the prebuilt `LayerPanel`.
```jsx
import { LayerPanel, LayerPanelPage, LayerPanelHeader, LayerPanelContent } from '@bayer/ol-kit'
import VpnKeyIcon from '@material-ui/icons/VpnKeyIcon'

// Passing the props through the LayerPanel component
return (
  <LayerPanel handleFeatureDoubleClick={this.onFeatureDoubleClick} layerPanelTitle='My Layer Panel'>
    <LayerPanelPage tabIcon={<VpnKeyIcon />}>
      <LayerPanelHeader
        title='Legends Page'
        avatar={<VpnKeyIcon />} />
      <LayerPanelContent>
        Hello world
      </LayerPanelContent>
    </LayerPanelPage>
  </LayerPanel>
)

// Directly pulling in the LayerPanelLayersPage and passing props through it
return (
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
)
```

To show you the amount of customization possible with these pages, here's the `LayerPanelLayersPage`.
```jsx
import {
  LayerPanel,
  LayerPanelPage,
  LayerPanelHeader,
  LayerPanelContent,
  LayerPanelActions,
  LayerPanelCheckbox,
  LayerPanelActionRemove,
  LayerPanelActionImport,
  LayerPanelActionExport,
  LayerPanelList,
  LayerPanelListItem } from '@bayer/ol-kit'
import VpnKeyIcon from '@material-ui/icons/VpnKeyIcon'
import MoreHorizIcon from '@material-ui/icons/MoreHorizIcon'

return (
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
)
```










