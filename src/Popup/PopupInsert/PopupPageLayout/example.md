The `PopupPageLayout` component provides out-of-the-box paging capabilities for popups. All child components within a `PopupPageLayout` are managed by the page layout and only one page is shown at a time.

```jsx
return (
  <Popup show={true} pixel={[50, 150]} arrow={'left'} inline={true}>
    <PopupPageLayout>
      {[{name: 'My feature'}, {name: 'Your feature'}].map(feature => {
        // with Openlayers features, you'd do `attributes={feature.getProperties()}`
        return <PopupDefaultPage title={feature.name} attributes={feature} />
      })}
    </PopupPageLayout>
  </Popup>
)
```

If you intend to create custom pages with different styling than the `PopupPageLayout` you can do so. See the docs on `PopupPageLayoutChild` for how to create custom page experiences without having to manage page state.
