import { jsPDF } from 'jspdf'
import ugh from 'ugh'

export function convertSvgToTemplate (svg, inputs) {
  const svgDoc = svg.contentDocument
  const elements = inputs.map(input => {
    const { content, id, type } = input
    const convertToPixels = attribute => {
      if (attribute.split('mm').length > 1) {
        // convert mm to pixel here
        const [milimeters] = attribute.split('mm')
        const pixels = milimeters * 3.78 // mm to pixel conversion
        
        return pixels
      }
      // add more catches to convert other units here

      return attribute
    }
    const element = svgDoc.getElementById(id)
    if (!element) {
      ugh.warn(`Element with id '${id}' is missing from svg document`)
      return undefined // this will be filtered out
    }
    const x = convertToPixels(element.getAttribute('x'))
    const y = convertToPixels(element.getAttribute('y'))
    const height = convertToPixels(element.getAttribute('height'))
    const width = convertToPixels(element.getAttribute('width'))
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
    dimensions: [793, 1112],
    orientation: 'landscape',
    fileName: 'kill_geoprint.pdf',
  }

  return template
}

export async function printPDF (template) {
  const {
    dimensions,
    elements,
    fileName,
    orientation,
  } = template
  const doc = new jsPDF({
    orientation,
    unit: 'px',
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

  // download pdf
  doc.save(fileName)
}