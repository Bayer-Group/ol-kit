# Open Data Sources

This is a collection of data that easily plugs into `loadDataLayer` for quick, interesting data that can be visualized on a map.

## Schema

Each data source (found in `dataSources.json`) looks something like this:

```json
{
  "id": "NASA_COUNTRY_BOUNDARIES",
  "url": "https://data.nasa.gov/api/geospatial/7zbq-j77a?method=export&format=KML",
  "desc": "NASA Geopolitcal Boundaries"
}
```

`id` - a unique identifier that can be used to find a layer on a map
`url` - a url to be passed into `loadDataLayer`
`desc` - a human-readable description of the data served by the above `url`