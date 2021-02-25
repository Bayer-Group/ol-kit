The `PopupTabs` component makes it easy to create a tabbed layout within a popup.

```jsx
return (
  <Popup show={true} pixel={[150, 310]} arrow={'bottom'} inline={true}>
    <PopupTabs>
      <div title='details'>
        details could go here
      </div>
      <div title='actions'>
        actions could go here
      </div>
    </PopupTabs>
  </Popup>
)
```

You can create as many tabs as you wish and the popup can be any size.
```jsx
return (
  <Popup show={true} width={400} height={300} pixel={[50, 150]} arrow={'left'} inline={true}>
    <PopupTabs>
      <div title='Current Weather'>
        The current temperature is not 50 degrees :D
      </div>
      <div title='3-Day Forcast'>
        Monday - 30 | Tuesday - 40 | Wednesday - 50
      </div>
      <div title='Settings'>
        You can adjust the weather settings here
      </div>
    </PopupTabs>
  </Popup>
)
```
