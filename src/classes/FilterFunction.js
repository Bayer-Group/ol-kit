import olFilterComparisonBinary from 'ol/format/filter/comparisonbinary'

class Function extends olFilterComparisonBinary {
  constructor (name, propertyName, expression) {
    super('PropertyName', propertyName, expression)

    this.name = name
  }
}

export default Function
