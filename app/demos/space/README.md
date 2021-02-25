### Space Demo

This demo is actually 3 seperate layers in one unlike the covid demo. Users can decide what layers they want visible using the layer panel. We've tried to add comments to the files to make it easier to reuse some of our code

### How it works:

#### ISS (international space station)

The App.js file here is very simple, we're essentialy loading an `ol-kit` map, and adding more `ol-kit` components namely, `Popup`, `TimeSlider`, `LayerPanel`, `BasemapContainer` `Controls`, `LayerPanelContent`, `LayerPanelPage`, `LayerStyler`, `loadDataLayer` you can read about all of these components on our [docs page](https://ol-kit.com/docs.html)

#### ISS.js (International Space Station Tracker)

This is a very cool feature that shows us the path of the ISS, it is also very easy to implement!

 We essentially are calling an API that sends us the current coordinates for the ISS, we then convert these coordinates to a format the map can understand using an `ol` function called [fromLonLat](https://openlayers.org/en/latest/apidoc/module-ol_proj.html).

We then create a feature using the current coordinates then add that to the `ISS` layer on the map. This function runs every 2 seconds. Note that we are not creating a new layer on every call, that would be very difficult to track. Rather we are creating a new feature on each call and adding that to the existing layer


#### Space X

We start by creating GraphQL requests to SpaceX's API. If you are unfamiliar with GraphQL you can learn more [Here](https://graphql.org/learn/), we are then styling the data and creating a layer similar to the other features above. What makes this demo special is that we are getting data with timestamps on it, which can integrate with `ol-kit's` `TimeSlider` component. All we have to do is pass the `_ol_kit_time_key: 'launch_date_utc'` to the layer, so the `TimeSlider` knows what field to look at!