import React, { useState } from 'react'
import PropTypes from 'prop-types'
import SearchIcon from '@material-ui/icons/Search'
import { connectToMap, centerAndZoom } from 'Map'
import VectorLayer from '../classes/VectorLayer'
import olCollection from 'ol/collection'
import olVectorSource from 'ol/source/vector'
import olFeature from 'ol/feature'
import olStyle from 'ol/style/style'
import olStroke from 'ol/style/stroke'
import olFill from 'ol/style/fill'
import olCircleStyle from 'ol/style/circle'
import olPoint from 'ol/geom/point'
import { useForm } from 'react-hook-form'
import proj from 'ol/proj'
import { Paper, IconButton, Input, SearchBarContainer, Alert } from './styled'

/** A search input to look up and label locations via Google Places API
 * @component
 * @category GooglePlacesSearch
 * @since 0.8.0
 */
function GooglePlacesSearch (props) {
  const { map, apiKey } = props
  const { handleSubmit, register } = useForm()
  const [errorMessage, setError] = useState(null)

  const dataLoader = (searchString) => {
    return fetch(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${searchString}&inputtype=textquery&fields=geometry,formatted_address&key=${apiKey}`)
      .then(response => response.json())
      .then(json => {
        if (json.status === 'ZERO_RESULTS') {
          throw new Error('Place not found')
        } else if (json.status === 'REQUEST_DENIED') {
          throw new Error('The provided API key is invalid')
        } else {
          return {
            x: json.candidates[0].geometry.location.lng,
            y: json.candidates[0].geometry.location.lat,
            formatted_address: json.candidates[0].formatted_address
          }
        }
      })
  }

  const onSubmit = async (data) => {
    try {
      const location = await dataLoader(data.searchPlace)
      const source = new olVectorSource({ features: new olCollection() })
      const vectorLayer = new VectorLayer({ source, title: 'Google Places Search' })
      const coords = proj.fromLonLat([location.x, location.y])
      const feature = new olFeature(new olPoint(coords))
      const radius = 15
      const color = 'blue'

      map.addLayer(vectorLayer)
      feature.setProperties({ title: location.formatted_address })
      feature.setStyle(
        new olStyle({
          image: new olCircleStyle({
            radius,
            fill: new olFill({ color }),
            stroke: new olStroke({
              color,
              width: 3
            })
          })
        })
      )
      feature.getStyle().getImage().setOpacity(0.5)
      vectorLayer.getSource().getFeaturesCollection().clear()
      vectorLayer.getSource().getFeaturesCollection().push(feature)
      centerAndZoom(map, { ...location, zoom: 10 })
      setError(null)
    } catch (error) {
      setError(error.message)
    }
  }
  const handleClose = () => {
    setError(null)
  }

  return (
    <SearchBarContainer>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Paper>
          <Input
            type='text'
            name='searchPlace'
            placeholder='Search Google Places'
            ref={register} />
          <IconButton type='submit' aria-label='search' >
            <SearchIcon />
          </IconButton>
        </Paper>
      </form>
      {
        errorMessage ? <Alert severity='error' onClose={handleClose}>
          {errorMessage}
        </Alert> : null
      }
    </SearchBarContainer>
  )
}

GooglePlacesSearch.propTypes = {
  /** reference to Openlayers map object */
  map: PropTypes.object.isRequired,
  /* Note that you will need to create an account with Google and get an API key. Be sure to turn on all location based permissions.
   You can find instructions on how to do that here https://developers.google.com/places/web-service/intro */
  apiKey: PropTypes.string.isRequired
}

export default connectToMap(GooglePlacesSearch)
