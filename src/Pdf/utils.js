import { jsPDF } from 'jspdf'
import ugh from 'ugh'

/**
 * Take an svg template and list of inputs and convert it into a fully loaded template to print a PDF
 * @function
 * @category PDF
 * @since 1.12.0
 * @param {String} svg - Stringified svg used as a template for creating pdf
 * @param {Object[]} inputs - Array of inputs that fill in the svg elements required: { id: string, type: 'text' | 'image', content: canvas | string, uri: string }
 * @param {Object} opts - Non template options: { fileName: string }
 * @returns {Object} Template ready to be used by `printPDF`
 */
export function convertSvgToPDFTemplate (svgString, inputs, opts = {}) {
  const { fileName } = opts
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
      width
    }

    return config
  }).filter(element => element)

  const template = {
    elements,
    dimensions,
    orientation,
    unit,
    fileName
  }

  return template
}

/**
 * Build a PDF from a template and print locally
 * @function
 * @category PDF
 * @since 1.12.0
 * @param {Object} template - { elements, dimensions, orientation, unit, fileName }
 * @param {Object} opts - PDF options: { hideLogo: false }
 * @returns {Object}
 */
export async function printPDFTemplate (template, passedOpts) {
  const opts = {
    hideLogo: false,
    ...passedOpts
  }
  const {
    dimensions,
    elements = [],
    fileName = 'ol-kit-map',
    orientation = 'landscape',
    unit = 'px'
  } = template
  const doc = new jsPDF({
    orientation,
    unit,
    format: dimensions
  })

  elements.forEach(element => {
    const {
      id,
      type,
      content,
      x,
      y,
      height,
      width,
      uri
    } = element

    if (type === 'image') {
      // http://raw.githack.com/MrRio/jsPDF/master/docs/module-addImage.html
      if (uri) {
        const image = new Image()

        image.src = uri
        doc.addImage(image, 'JPEG', x, y, width, height, id, 'NONE', 0)
      } else {
        // canvas print
        doc.addImage(content, 'JPEG', x, y, width, height, id, 'NONE', 0)
      }
    } else if (type === 'text') {
      doc.text(content, x, y)
    }
  })

  if (!opts.hideLogo) {
    const image = new Image()

    image.src = 'https://ol-kit.com/favicon.ico'
    doc.addImage(image, 'JPEG', 0, 0, 30, 30, '_ol_kit_logo', 'NONE', 0)
  }

  // download pdf
  doc.save(fileName)
}
