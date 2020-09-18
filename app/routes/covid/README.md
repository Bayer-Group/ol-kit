## COVID-19 Demo

This demo pulls geogrpahical COVID data from the [ArcGIS](arcgis.com) which is very repuatable in the Geospatial industry. Each major area in the US will have a red circle, and the radius will increase depending on the number of confirmed cases.

### How it works:

#### App.js

The App.js file here is very simple, we're essentialy loading an `ol-kit` map, the same way shown in the start up docs. The only difference is that now we have a `<DataLoader />` component which is handling all the magic.

#### Dataloader.js

Here we are calling ArcGIS using the built-in JavaScript library called `fetch`, and we're getting back a large array of coordinates and confirmed cases corresponding to those coordinates.

We first convert the coordinates from the data to a projection our map can understand using a function from openlayers called [fromLatLon](https://openlayers.org/en/latest/apidoc/module-ol_proj.html)

Then we determine the radius of the circle based on the number of confirmed cases. 
`const radius = hasConfirmed ? feat.attributes.Confirmed / 1500 : feat.attributes.Confirmed`

We then aggregrate the location of these circles and extra metadata into a `features` array, style it using the [setStyle function from open layers](https://openlayers.org/en/latest/apidoc/module-ol_Feature-Feature.html#setStyle) and then plot these features on to the map.

Instead of using classic react lifecycle components like `componentDidMount` and `componentDidUpdate` we are using a newer React feature called [React Hooks](https://reactjs.org/docs/hooks-intro.html), specifically [useEffect](https://reactjs.org/docs/hooks-effect.html) in this case