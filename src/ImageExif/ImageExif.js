import React, { useCallback } from 'react'
import { connectToContext } from '@bayer/ol-kit'
import transformTranslate from '@turf/transform-translate'
import Feature from 'ol/Feature'
import VectorLayer from 'ol/layer/Vector'
import Point from 'ol/geom/Point'
import Circle from 'ol/geom/Circle'
import LineString from 'ol/geom/LineString'
import GeoJSON from 'ol/format/GeoJSON'
import PropTypes from 'prop-types'
import en from 'locales/en'
import { Container, InnerContainer, InputContainer, Title } from './styled'
import { useDropzone } from 'react-dropzone'
import ExifReader from 'exifreader'
import VectorSource from 'ol/source/Vector'
import { fromLonLat } from 'ol/proj'

const format = new GeoJSON()
const projectionOpts = {
  decimals: 8,
  dataProjection: 'EPSG:4326',
  featureProjection: 'EPSG:3857'
}

export const olToGeojson = (feature) => {
  return format.writeFeatureObject(feature, projectionOpts)
}

export const geojsonToOl = (feature) => {
  if (feature.type === 'FeatureCollection') {
    return format.readFeatures(feature, projectionOpts)
  } else {
    return format.readFeature(feature, projectionOpts)
  }
}

function ImageExif (props) {
  const { map, translations } = props
  const onDrop = useCallback(acceptedFiles => {
    const features = []
    const reader = new FileReader()

    reader.onloadend = function (e) {
      const tags = ExifReader.load(e.target.result)
      const tagKeys = Object.keys(tags).sort()
      const sortedProperties = {}

      tagKeys.forEach(x => {
        sortedProperties[x] = tags[x].description
      })

      // Image Location
      const imageLat = sortedProperties.GPSLatitude
      const imageLong = sortedProperties.GPSLongitude
      const coords = fromLonLat([imageLong * -1, imageLat])
      const centerPoint = new Point(coords)
      const imageLocationFeature = new Feature(centerPoint)

      imageLocationFeature.setProperties(sortedProperties)
      imageLocationFeature.set('title', 'Captured Image')
      imageLocationFeature.set('name', 'Image Location')
      features.push(imageLocationFeature)

      // Image Location Error Margin
      const imageLocationError = Number(sortedProperties.GPSHPositioningError)
      const errorRadius = new Circle(coords, imageLocationError)
      const errorRadiusFeature = new Feature(errorRadius)

      errorRadiusFeature.setProperties({ 'Error Radius (meters)': imageLocationError })
      errorRadiusFeature.set('title', 'Image Location Error Radius')
      errorRadiusFeature.set('name', 'Error Radius')
      features.push(errorRadiusFeature)

      // Image Bearing Line
      const imageBearing = sortedProperties.GPSDestBearing
      const geojsonPoint1 = olToGeojson(imageLocationFeature)
      const geojsonPoint2 = transformTranslate(geojsonPoint1, imageLocationError, imageBearing, { units: 'meters' })
      const olPoint1 = geojsonToOl(geojsonPoint1).getGeometry().getCoordinates()
      const olPoint2 = geojsonToOl(geojsonPoint2).getGeometry().getCoordinates()
      const lineThing = new LineString([olPoint1, olPoint2])
      const bearingFeature = new Feature(lineThing)

      bearingFeature.set('title', 'Image Bearing')
      bearingFeature.set('name', 'Image Bearing')
      features.push(bearingFeature)

      const source = new VectorSource({ features })
      const vectorLayer = new VectorLayer({ source })

      vectorLayer.set('title', 'Image Location')

      map.addLayer(vectorLayer)
    }
    reader.onerror = function (e) {
      // eslint-disable-next-line no-console
      console.log(e.target.error)
    }
    reader.readAsArrayBuffer(acceptedFiles[0])
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <Container>
      <Title>{translations['_ol_kit.ImageExif.title']}</Title>
      <InnerContainer>
        <InputContainer>
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            {
              isDragActive
                ? <p>Drop the files here ...</p>
                : <p>Drag and drop some files here, or click to select files</p>
            }
          </div>
        </InputContainer>
      </InnerContainer>
    </Container>
  )
}

ImageExif.propTypes = {
  /** Object with key/value pairs for translated strings */
  translations: PropTypes.shape({
    '_ol_kit.ImageExif.title': PropTypes.string
  }).isRequired,
  map: PropTypes.object
}

ImageExif.defaultProps = {
  translations: en
}

export default connectToContext(ImageExif)
