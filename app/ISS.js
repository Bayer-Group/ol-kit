import React from 'react'

import VectorLayer from 'classes/VectorLayer'
import olSourceVector from 'ol/source/vector'
import olFeature from 'ol/feature'
import olGeomPoint from 'ol/geom/point'
import olProj from 'ol/proj'
import olStyle from 'ol/style/style'
import olStroke from 'ol/style/stroke'
import olIcon from 'ol/style/icon'

import { connectToMap } from 'Map'

function ISS (props) {
  const { map } = props

  const layer = new VectorLayer({
    title: 'ISS Tracker',
    source: new olSourceVector({ features: [] }),
    _ol_kit_time_key: 'time'
  })

  setInterval(async () => {
    const data = await fetch('http://api.open-notify.org/iss-now.json')
    const res = await data.json()
    const lonLat = [Number(res.iss_position.longitude), Number(res.iss_position.latitude)]

    const iconStyle = new olStyle({
      stroke: new olStroke(),
        image: new olIcon({
        opacity: 1,
        src: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/International_Space_Station.svg',
        scale: .05
      })
    })
    const feature = new olFeature({
      geometry: new olGeomPoint(olProj.fromLonLat(lonLat))
    })

    feature.setStyle(iconStyle)
    feature.set('time', new Date().toString())

    layer.getSource().addFeature(feature)
  }, 2000)

  // const styleFunc = feature => {
  //   console.log('feat?', feature)
  //   if (!feature) return []
  //
  //   const geometry = feature.getGeometry()
  //   const styles = [
  //     new olStyle({
  //       stroke: new Stroke({
  //         color: 'red',
  //         width: 2
  //       })
  //     })
  //   ]
  //
  //   geometry.forEachSegment(function(start, end) {
  //     if (geometry.length === styles.length + 1) {
  //       // add ISS for end of segments
  //       styles.push(new olStyle({
  //         geometry: new olGeomPoint(end),
  //         image: new olIcon({
  //           opacity: 1,
  //           src: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/International_Space_Station.svg',
  //           scale: .05
  //         })
  //       }));
  //     } else {
  //       styles.push(new olStyle({
  //         stroke: new Stroke({
  //           color: 'red',
  //           width: 2
  //         })
  //       }))
  //     }
  //   });
  //
  //   return styles;
  // }


  map.addLayer(layer)

  return null
}

export default connectToMap(ISS)
