import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { connectToMap } from 'Map'
import VectorLayer from 'classes/VectorLayer'
import olSourceVector from 'ol/source/vector'
import olFeature from 'ol/feature'
import olGeomPoint from 'ol/geom/point'
import olProj from 'ol/proj'
import olStyle from 'ol/style/style'
import olStroke from 'ol/style/stroke'
import olIcon from 'ol/style/icon'

const GET_PADS = gql`
{
  landpads {
    location {
      latitude
      longitude
      name
      region
    }
    full_name
    landing_type
    attempted_landings
  }
}
`
const GET_FLIGHTS = gql`
{
  launchesPastResult {
    data {
      launch_site {
        site_id
        site_name_long
        site_name
      }
      launch_date_utc
    }
  }
}
`
const GET_LAUNCHPADS = gql`
{
  launchpads {
    location {
      latitude
      longitude
      name
      region
    }
    name
    successful_launches
    vehicles_launched {
      id
      cost_per_launch
    }
    wikipedia
    id
    details
  }
}
`

function SpaceX (props) {
  const { map } = props
  const { loading: loadingPads, data: padsData } = useQuery(GET_PADS)
  const { loading: loadingFlights, data: flightsData } = useQuery(GET_FLIGHTS)
  const { loading: loadingLaunch, data: launchData } = useQuery(GET_LAUNCHPADS)

  if (!loadingPads && !!padsData) {
    const features = padsData.landpads.map(pad => {
      const iconStyle = new olStyle({
        stroke: new olStroke(),
            image: new olIcon({
          opacity: 1,
          src: 'https://edge.alluremedia.com.au/uploads/businessinsider/2018/02/boosters_spacex.jpg',
          scale: .05
        })
      })
      const feature = new olFeature({
        geometry: new olGeomPoint(olProj.fromLonLat([
          pad.location.longitude, pad.location.latitude
        ]))
      })

      feature.setStyle(iconStyle)
      feature.setProperties({ ...pad, title: pad.full_name, name: pad.full_name })

      return feature
    })
    const layer = new VectorLayer({
      title: 'Space X Land Pads',
      source: new olSourceVector({ features })
    })


    map.addLayer(layer)
  }

  if (!loadingFlights && !!flightsData && !loadingLaunch && !!launchData) {
    console.log('flightsData', flightsData, launchData)
    const features = flightsData.launchesPastResult.data.map(flight => {
      const iconStyle = new olStyle({
        stroke: new olStroke(),
            image: new olIcon({
          opacity: 1,
          src: 'https://edge.alluremedia.com.au/uploads/businessinsider/2018/02/boosters_spacex.jpg',
          scale: .05
        })
      })
      const padthing = launchData.launchpads.find((pad) => pad.id === flight.launch_site.site_id)
      const latlong = [padthing.location.longitude, padthing.location.latitude]
      const feature = new olFeature({
        geometry: new olGeomPoint(olProj.fromLonLat( latlong ))
      })

      // feature.setStyle(iconStyle)
      feature.setProperties({ ...flight, title: flight.launch_site.site_name, name: flight.launch_site.site_name })

      return feature
    })
    const layer = new VectorLayer({
      title: 'Space X Launch History',
      source: new olSourceVector({ features }),
      _ol_kit_time_key: 'launch_date_utc'
    })


    map.addLayer(layer)
  }



  return null

}

export default connectToMap(SpaceX)
