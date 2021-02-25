A `PopupActionGroup` allows you to create nested menus of `PopupActionItem` components. It's as easy as passing `PopupActionGroup` a title and then an array of `PopupActionItem` children.

```jsx
return (
  <Popup show={true} pixel={[205, 310]} arrow={'bottom'} inline={true}>
    <PopupActionGroup title={'Create'}>
      <PopupActionItem title="New Production Field" />
      <PopupActionItem title="Site Boundary" />
    </PopupActionGroup>
    <PopupActionGroup title={'Edit'}>
      <PopupActionItem title="Geometry" />
      <PopupActionItem title="Attributes" />
    </PopupActionGroup>
    <PopupActionItem title="Delete" />
  </Popup>
)
```

You can nest `PopupActionGroup` components within themselves to create nested menus. There is no limit on the nested levels.

```jsx
return (
  <Popup show={true} pixel={[50, 10]} inline={true}>
    <PopupPageLayout>
      <PopupDefaultPage currentTab={1} title={'KENTEST2000'} attributes={{ hello: 'world' }}>
        <PopupActionItem title="Buffer"/>
        <PopupActionGroup title={'Edit'}>
          <PopupActionItem title="Geometry" />
          <PopupActionItem title="Merge" />
          <PopupActionItem title="Duplicate Shape" />
          <PopupActionGroup title={'Edit'}>
            <PopupActionItem title="Geometry" />
            <PopupActionItem title="Merge" />
            <PopupActionItem title="Duplicate Shape" />
          </PopupActionGroup>
        </PopupActionGroup>
        <PopupActionItem title="View" />
      </PopupDefaultPage>
    </PopupPageLayout>
  </Popup>
)
```
