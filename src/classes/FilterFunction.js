import olFilterComparisonBinary from 'ol/format/filter/ComparisonBinary'

class Function extends olFilterComparisonBinary {
  constructor (name, propertyName, expression) {
    super('PropertyName', propertyName, expression)

    this.name = name
  }
}

export default Function
