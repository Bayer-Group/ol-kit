To render a list of key/value pairs like a GIS feature's attributes, the `PopupDataList` shows the key and its corresponding value underneath given an `attributes` prop.

```jsx
return (
  <Popup show={true} pixel={[0, 150]} arrow={'left'} inline={true}>
    <PopupDataList attributes={{key: 'value', anotherKey: true, optionalKey: null}} />
  </Popup>
)
```
