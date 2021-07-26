import { jsPDF } from 'jspdf'
import ugh from 'ugh'

import OL_KIT_MARK from 'images/ol_kit_mark.svg'

export function convertSvgToTemplate (svgString, inputs) {
  const parser = new DOMParser()
  const svgDoc = parser.parseFromString(svgString, 'application/xml')
  const svgContainer = svgDoc.children[0]
  const svgHeight = svgContainer.getAttribute('height')
  const svgWidth = svgContainer.getAttribute('width')

  // calc unit from svg
  let unit
  if (svgHeight.split('mm').length > 1) unit = 'mm'
  else if (svgHeight.split('cm').length > 1) unit = 'cm'
  else if (svgHeight.split('m').length > 1) unit = 'm'
  else if (svgHeight.split('px').length > 1) unit = 'px'
  else if (svgHeight.split('pt').length > 1) unit = 'pt'
  else if (svgHeight.split('in').length > 1) unit = 'in'
  const numberify = string => {
    const [numberAsString] = string.split(unit) // closure, order matters

    return Number(numberAsString)
  }
  // calc dimensions from svg
  const height = numberify(svgHeight)
  const width = numberify(svgWidth)
  const orientation = width > height ? 'landscape' : 'portrait'
  const dimensions = [height, width]

  const elements = inputs.map(input => {
    const { content, id, type } = input
    const element = svgDoc.getElementById(id)
    if (!element) {
      ugh.warn(`Element with id '${id}' is missing from svg document`)
      return undefined // this will be filtered out
    }
    const x = numberify(element.getAttribute('x'))
    const y = numberify(element.getAttribute('y'))
    const height = numberify(element.getAttribute('height'))
    const width = numberify(element.getAttribute('width'))
    const config = {
      id,
      type,
      content,
      x,
      y,
      height,
      width,
    }

    return config
  }).filter(element => element)

  const template = {
    elements,
    dimensions,
    orientation,
    unit,
    fileName: 'kill_geoprint.pdf',
  }

  return template
}

export async function printPDF (template, passedOpts) {
  const opts = {
    hideLogo: true, // TODO false
    ...passedOpts
  }
  const {
    dimensions,
    elements = [],
    fileName = 'ol-kit-map',
    orientation = 'landscape',
    unit = 'px',
  } = template
  const doc = new jsPDF({
    orientation,
    unit,
    format: dimensions
  })

  elements?.forEach(element => {
    const {
      id,
      type,
      content,
      x,
      y,
      height,
      width,
    } = element

    console.log('template element', element)

    if (type === 'image') {
      // http://raw.githack.com/MrRio/jsPDF/master/docs/module-addImage.html
      doc.addImage(content, 'JPEG', x, y, width, height, id, 'NONE', 0)
    } else if (type === 'text') {
      doc.text(content, x, y)
    }
  })

  if (!opts.hideLogo) {
    const img = document.createElement('img')

    img.setAttribute('src', OL_KIT_MARK)
    document.body.appendChild(img)
    doc.addImage(img, 'WEBP', 0, 0, 30, 30, '_ol_kit_logo', 'NONE', 0)
    console.log('do not hide logo')
  }

  // download pdf
  doc.save(fileName)
}