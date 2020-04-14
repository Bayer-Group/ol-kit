A `PopupActionItem` is a list item which renders within a popup. You can pass `PopupActionItem` a simple string `title` and bind an `onClick` to do whatever you wish when a user selects the item. If an item should be disabled, pass `disabled={true}` and your `onClick` won't be called when the item is clicked.

```jsx
<Popup show={true} pixel={[50, 10]} inline={true}>
  <PopupActionItem title="My Action" />
  <PopupActionItem disabled={true} title="Disabled Action" />
</Popup>
```

If you desire to completely customize your action item, pass a child component into the `PopupActionItem` to render a completely custom item.

```jsx
<Popup show={true} pixel={[50, 10]} inline={true}>
  <PopupActionItem title="My Action" />
  <PopupActionItem>
    <div style={{background: '#ec0000', padding: '20px', color: 'white'}}>
      <i className="zmdi zmdi-delete" style={{ paddingRight: '20px'}}></i>
      Custom Danger Action
    </div>
  </PopupActionItem>
</Popup>
```
