import React, { useCallback } from 'react'
import { connectToContext } from '@bayer/ol-kit'
import transformTranslate from '@turf/transform-translate'
import Feature from 'ol/Feature'
import VectorLayer from 'ol/layer/Vector'
import { Circle, LineString, Point } from 'ol/geom'
import GeoJSON from 'ol/format/GeoJSON'
import { Icon, Stroke, Style } from 'ol/style'
import PropTypes from 'prop-types'
import en from 'locales/en'
import { Container, InnerContainer, InputContainer, Title } from './styled'
import { useDropzone } from 'react-dropzone'
import ExifReader from 'exifreader'
import VectorSource from 'ol/source/Vector'
import { fromLonLat } from 'ol/proj'
import arrow from './arrow.png'
import { v4 as uuidv4 } from 'uuid'

const format = new GeoJSON()
const projectionOpts = {
  decimals: 8,
  dataProjection: 'EPSG:4326',
  featureProjection: 'EPSG:3857'
}

const olToGeojson = (feature) => {
  return format.writeFeatureObject(feature, projectionOpts)
}

const geojsonToOl = (feature) => {
  if (feature.type === 'FeatureCollection') {
    return format.readFeatures(feature, projectionOpts)
  } else {
    return format.readFeature(feature, projectionOpts)
  }
}

function ImageExif (props) {
  const { map, translations } = props
  const styleFunction = feature => {
    const geometry = feature.getGeometry()
    const styles = [
      // linestring
      new Style({
        stroke: new Stroke({
          color: '#ffcc33',
          width: 2
        })
      })]

    geometry.forEachSegment((start, end) => {
      const dx = end[0] - start[0]
      const dy = end[1] - start[1]
      const rotation = Math.atan2(dy, dx)
      // arrows

      styles.push(
        new Style({
          geometry: new Point(end),
          image: new Icon({
            src: arrow,
            anchor: [0.75, 0.5],
            rotateWithView: true,
            rotation: -rotation
          })
        })
      )
    })

    return styles
  }

  const onDrop = useCallback(acceptedFiles => {
    const unlocatableFiles = []

    acceptedFiles.forEach((file, i, arr) => {
      const features = []
      const imageId = uuidv4()
      const imageName = file.name
      const imageURL = URL.createObjectURL(file)
      const reader = new FileReader()

      reader.onloadend = () => {
        const endOfFiles = (i + 1 === arr.length)

        if (endOfFiles && unlocatableFiles.length) {
          // eslint-disable-next-line no-alert,no-undef
          alert(`${unlocatableFiles.length} file(s) missing location data and could not be added.`)
        }
      }

      reader.onload = function (e) {
        const tags = ExifReader.load(e.target.result)
        const imageIsGeotagged = !!(tags.GPSLatitude && tags.GPSLongitude)

        if (imageIsGeotagged) {
          const tagKeys = Object.keys(tags).sort()
          const sortedProperties = {}

          tagKeys.forEach(x => {
            sortedProperties[x] = tags[x].description
          })

          // Image Location
          const latRef = sortedProperties.GPSLatitudeRef === 'North latitude' ? 'N' : 'S'
          const longRef = sortedProperties.GPSLongitudeRef === 'West longitude' ? 'W' : 'E'
          const imageLat = (latRef === 'N') ? sortedProperties.GPSLatitude : sortedProperties.GPSLatitude * -1
          const imageLong = (longRef === 'W') ? (sortedProperties.GPSLongitude * -1) : sortedProperties.GPSLongitude
          const coords = fromLonLat([imageLong, imageLat])
          const centerPoint = new Point(coords)
          const imageLocationFeature = new Feature(centerPoint)

          imageLocationFeature.setProperties(sortedProperties)
          imageLocationFeature.set('title', 'Captured Image')
          imageLocationFeature.set('name', imageName)
          imageLocationFeature.set('imageId', imageId)
          imageLocationFeature.set('imageURL', imageURL)
          features.push(imageLocationFeature)

          // Image Location Error Margin
          const imageLocationError = Number(sortedProperties.GPSHPositioningError)

          if (imageLocationError) {
            const errorRadius = new Circle(coords, imageLocationError)
            const errorRadiusFeature = new Feature(errorRadius)

            errorRadiusFeature.setProperties({ 'Error Radius (meters)': imageLocationError })
            errorRadiusFeature.set('title', 'Image Location Error Radius')
            errorRadiusFeature.set('name', 'Error Radius')
            errorRadiusFeature.set('imageId', imageId)
            errorRadiusFeature.set('imageURL', imageURL)
            errorRadiusFeature.setStyle(new Style({
              stroke: new Stroke({
                lineDash: [4, 8],
                color: '#ff0000',
                width: 2
              })
            }))
            features.push(errorRadiusFeature)
          }

          // Image Bearing Line
          const imageBearing = sortedProperties.GPSDestBearing

          if (imageBearing) {
            const geojsonPoint1 = olToGeojson(imageLocationFeature)
            const geojsonPoint2 = transformTranslate(geojsonPoint1, 2, imageBearing, { units: 'meters' })
            const olPoint1 = geojsonToOl(geojsonPoint1).getGeometry().getCoordinates()
            const olPoint2 = geojsonToOl(geojsonPoint2).getGeometry().getCoordinates()
            const lineThing = new LineString([olPoint1, olPoint2])
            const bearingFeature = new Feature(lineThing)

            bearingFeature.set('title', 'Image Bearing')
            bearingFeature.set('name', 'Image Bearing')
            bearingFeature.set('imageId', imageId)
            bearingFeature.setStyle(styleFunction)
            bearingFeature.set('imageURL', imageURL)
            features.push(bearingFeature)
          }

          const source = new VectorSource({ features })
          const vectorLayer = new VectorLayer({ source })

          vectorLayer.set('title', 'Image Location')

          map.addLayer(vectorLayer)
        } else {
          unlocatableFiles.push(file)
        }
      }
      reader.onerror = function (e) {
        // eslint-disable-next-line no-console
        console.log(e.target.error)
      }
      reader.readAsArrayBuffer(file)
    })
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ accept: 'image/*', onDrop })

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
                : <p>Drag and drop some image files here, or click to select files</p>
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
