import olStyleFill from 'ol/style/Fill'
import olStyleStroke from 'ol/style/Stroke'
import olStyle from 'ol/style/Style'
import olStyleCircle from 'ol/style/Circle'
import { getVertices, pointsFromVertices } from '../Draw'
import olGeomPoint from 'ol/geom/Point'
import olStyleIcon from 'ol/style/Icon'
import tinycolor from 'tinycolor2'

const mapPin = '<path d="M3 0c-1.66 0-3 1.34-3 3 0 2 3 5 3 5s3-3 3-5c0-1.66-1.34-3-3-3zm0 1c1.11 0 2 .9 2 2 0 1.11-.89 2-2 2-1.1 0-2-.89-2-2 0-1.1.9-2 2-2z" transform="translate(1)" />'

function getSVGWrapper (svg, opts) {
  const path = svg.path || svg
  const viewBox = svg.viewBox || '0 0 8 8'
  const {
    stroke = {
      color: '',
      width: '',
      opacity: 1
    },
    fill = '#e82f1c',
    size = {
      width: 8,
      height: 8
    }
  } = opts

  // Chrome 72+ doesn't allow hex fill colors for SVG -- we ensure fills & strokes are always RGB
  return `<svg xmlns="http://www.w3.org/2000/svg" fill="${tinycolor(fill).toRgbString()}" stroke="${stroke.color ? tinycolor(stroke.color).toRgbString() : ''}" stroke-width="${stroke.width}" stroke-opacity="${stroke.opacity}" width="${size.width}" height="${size.height}" viewBox="${viewBox}" preserveAspectRatio="none">${path}</svg>`
}

function getSVGUri (path, opts = {}) {
  return window.encodeURI(getSVGWrapper(path, opts))
}

const fill = new olStyleFill({
  color: 'rgba(255,255,255,0.4)'
})

const stroke = new olStyleStroke({
  color: '#3399CC',
  width: 3.5
})

export const routeStyle = new olStyle({
  image: new olStyleCircle({
    fill,
    stroke,
    radius: 5
  }),
  fill,
  stroke
})

export const waypointPin = new olStyle({
  image: new olStyleCircle({
    fill,
    stroke: stroke,
    radius: 5
  }),
  geometry: getVertices
})

export const startPin = new olStyle({
  image: new olStyleIcon({
    anchor: [0.5, 1],
    opacity: 1,
    src: `data:image/svg+xml;utf8,${getSVGUri(mapPin, { fill: 'green', size: { height: 8, width: 8 } })}`,
    scale: 4
  }),
  geometry: feature => {
    const geom = feature.getGeometry()
    const points = pointsFromVertices(geom)

    return new olGeomPoint(points[0])
  }
})

export const endPin = new olStyle({
  image: new olStyleIcon({
    anchor: [0.5, 1],
    opacity: 1,
    src: `data:image/svg+xml;utf8,${getSVGUri(mapPin, { fill: 'red', size: { height: 8, width: 8 } })}`,
    scale: 4
  }),
  geometry: feature => {
    const points = pointsFromVertices(feature.getGeometry())

    return points.length > 1 ? new olGeomPoint(points[points.length - 1]) : null
  }
})
