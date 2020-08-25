To quickly get started using the new componentized popup, start by using `PopupDefaultPage` which handles most of the hard work for you in conjunction with `PopupPageLayout`.

```jsx
return (
  <Popup show={true} pixel={[50, 150]} arrow={'left'} inline={true}>
    <PopupPageLayout>
      <PopupDefaultPage title="Page 1" attributes={{someKey: 'some value'}}>
        <PopupActionItem title="Edit Feature" />
        <PopupActionItem title="Buffer Feature" />
      </PopupDefaultPage>
      <PopupDefaultPage title="Page 2" attributes={{anotherKey: 'another value'}}>
        <PopupActionItem title="Delete Item" />
      </PopupDefaultPage>
    </PopupPageLayout>
  </Popup>
)
```

In some cases you may want `PopupDefaultPage` to indicate to a user the feature it represents hasn't loaded yet. To do this, pass `loading={true}` and the page will show some semblance to the final rendered page with a loading indicator in place of the details and actions tabs.

```jsx
return (
  <Popup show={true} pixel={[50, 150]} arrow={'left'} inline={true}>
    <PopupPageLayout>
      <PopupDefaultPage title="Page 1" loading={true}>
        <PopupActionItem title="Edit Feature" />
        <PopupActionItem title="Buffer Feature" />
      </PopupDefaultPage>
      <PopupDefaultPage title="Page 2" loading={false} />
    </PopupPageLayout>
  </Popup>
)
```
