Popups are great for contextual content, interaction and controls that live relative to the map. The `pixel` prop determines the pixel location where the popup will be shown. By default the popup will position itself at the top left corner.

```jsx
return (
  <Popup show={true} pixel={[10, 10]} arrow={'none'} inline={true}>
    <p>This is text within a popup</p>
  </Popup>
)
```

For a better UX, use the `arrow` prop to tell the popup where it should show relative to the pixel coordinate you passed it. The default is `none` (example above) which means it doesn't show a directional arrow and positions on the top left corner. Below are some examples of the four different arrow positions you can choose from:

```jsx
return (
  <Popup show={true} pixel={[50, 80]} height={150} arrow={'left'} inline={true}>
    <p>This is <code>arrow="left"</code></p>
  </Popup>
)
```

```jsx
return (
  <Popup show={true} pixel={[350, 10]} height={150} width={500} arrow={'top'} inline={true}>
    <p>This is <code>arrow="top"</code></p>
  </Popup>
)
```

```jsx
return (
  <Popup show={true} pixel={[350, 310]} arrow={'bottom'} inline={true}>
    <p>This is <code>arrow="bottom"</code></p>
  </Popup>
)
```

```jsx
return (
  <Popup show={true} pixel={[550, 150]} width={500} arrow={'right'} inline={true}>
    <p>This is <code>arrow="right"</code></p>
  </Popup>
)
```
