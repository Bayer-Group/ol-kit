import { easeOut, linear } from 'ol/easing'

const OLZOOMBOXID = 'ol-css-zoombox-style'

export function replaceZoomBoxCSS () {
  const exists = document.getElementById(OLZOOMBOXID)

  if (!exists) {
    const style = window.document.createElement('style')

    style.id = OLZOOMBOXID
    style.textContent = '.ol-box{box-sizing:border-box;border:2px solid #000;outline:2px dashed #fff;outline-offset:-2px;}'

    window.document.head.append(style)
  }
}

export function rotateMap (map, rotation, duration = 350) {
  map.getView().animate({
    rotation,
    duration,
    easing: easeOut
  })
}

export function zoomDelta (map, delta, duration, easing = linear) {
  const newDuration = typeof duration === 'number' ? duration : 350
  const newEasing = typeof duration === 'function' ? duration : easing
  const view = map.getView()
  const currentResolution = view.getResolution()

  if (currentResolution && typeof view.animate === 'function') {
    view.animate({
      zoom: view.getZoom() + delta,
      duration: newDuration,
      easing: newEasing
    })
  }
}
