import { useState} from 'react'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { connectToMap } from 'Map'
import VectorLayer from 'classes/VectorLayer'
import olSourceVector from 'ol/source/Vector'
import olFeature from 'ol/Feature'
import olGeomPoint from 'ol/geom/Point'
import { fromLonLat } from 'ol/proj'
import olStyle from 'ol/style/Style'
import olStroke from 'ol/style/Stroke'
import olIcon from 'ol/style/Icon'

const GET_LANDPADS = gql`
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
  const [padsOnMap, setPadsOnMap] = useState(false)
  const [flightsOnMap, setFlightsOnMap] = useState(false)
  const { loading: loadingPads, data: padsData } = useQuery(GET_LANDPADS)
  const { loading: loadingFlights, data: flightsData } = useQuery(GET_FLIGHTS)
  const { loading: loadingLaunch, data: launchData } = useQuery(GET_LAUNCHPADS)

  if (!padsOnMap && !loadingPads && !!padsData) {
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
        geometry: new olGeomPoint(fromLonLat([
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
    setPadsOnMap(true)
  }

  if (!flightsOnMap && !loadingFlights && !!flightsData) {
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
        geometry: new olGeomPoint(fromLonLat( latlong ))
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
    setFlightsOnMap(true)
  }



  return null

}

export default connectToMap(SpaceX)
