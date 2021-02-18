A `PopupActionLink` is a list item which renders within a popup. You can pass `PopupActionLink` a simple string `title` and bind an `onClick` to do whatever you wish when a user selects the item. If an item should be disabled, pass `disabled={true}` and your `onClick` won't be called when the item is clicked.

```jsx
return (
  <Popup show={true} pixel={[50, 10]} inline={true}>
    <PopupActionLink title="My Action" href="https://ol-kit.com" />
    <PopupActionLink disabled={true} title="Disabled Action" href="https://ol-kit.com" />
  </Popup>
)
```

If you desire to completely customize your action item, pass a child component into the `PopupActionLink` to render a completely custom item.

```jsx
return (
  <Popup show={true} pixel={[50, 10]} inline={true}>
    <PopupActionLink title="My Action" href="#" />
    <PopupActionLink href="#">
      <div style={{background: '#ec0000', padding: '20px', color: 'white'}}>
        <i className="zmdi zmdi-delete" style={{ paddingRight: '20px'}}></i>
        Custom Danger Action
      </div>
    </PopupActionLink>
  </Popup>
)
```
