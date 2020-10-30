If you want an easy way to add a second page use the `LayerPanelPage` component and give it an icon. We use `@material-ui/icons` most of the time, they work well. This gives you a second page that has it's own tab to toggle through. Or if you want a title for the tab you can pass a label string prop.
```jsx
import { LayerPanel, LayerPanelPage, LayerPanelContent } from '@bayer/ol-kit'
import VpnKeyIcon from '@material-ui/icons/VpnKeyIcon'

return (
  <LayerPanel>
    <LayerPanelPage label={'Legends'} tabIcon={<VpnKeyIcon />}>
      <LayerPanelContent>
        Legends Page
      </LayerPanelContent>
    </LayerPanelPage>
  </LayerPanel>
)
```
![image](https://github.platforms.engineering/storage/user/2990/files/59702f80-86d2-11ea-8633-e35602cec3c5)