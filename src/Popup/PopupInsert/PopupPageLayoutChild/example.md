Within a `PopupPageLayout` you must provide child components which take the above documented props passed down automatically by `PopupPageLayout`. If you want an out-of-the-box solution, use `PopupDefaultPage`. If you need more customization you can create your own page component. This allows you to create navigation buttons and user experiences without having to build out logic to handle the actual navigation.

The `currentPage` and `pageCount` props make it possible to display where the user is within a series of pages. The `onNextPage` and `onPrevPage` functions allow you to tell the parent `PopupPageLayout` to navigate to the next or previous page, respectively.

Here's what a custom page might look like:

```jsx static
class CustomPopupPage extends Component {
  render () {
    const { attributes, children, onNextPage, onPrevPage, pageCount, currentPage } = this.props

    return (
      <div>
        <div>
          <button onClick={onPrevPage}>Previous</button>
          <div>{pageCount} total feature(s)</div>
          <button onClick={onNextPage}>Next</button>
        </div>
        <PopupTabs>
          <div title='details'>
            <DataList attributes={attributes} />
          </div>
          <div title='actions'>
            {children}
          </div>
        </PopupTabs>
      </div>
    )
  }
}
```

And then this component would be used like so:

```jsx static
return (
  <Popup show={true} pixel={[50, 150]} inline={true}>
    <PopupPageLayout>
      {this.props.features.map(f => {
        return (
          <CustomPopupPage title={f.get('title')} attributes={f.getProperties()}>
            <ActionItem title="edit" onClick={someHandler} />
          </CustomPopupPage>
        )
      })}
    </PopupPageLayout>
  </Popup>
)
```
