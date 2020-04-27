/**
 * @module ol/format/filter/Function
 */
import olFilterComparisonBinary from 'ol/format/filter/comparisonbinary'

/**
 * @classdesc
 * Represents a `<Function>` comparison operator.
 * @api
 */
class Function extends olFilterComparisonBinary {
  /**
   * [constructor description]
   * @param {!string} name name of function.
   */
  constructor (name, propertyName, expression) {
    super('PropertyName', propertyName, expression)

    /**
     * @type {!string}
     */
    this.name = name
  }
}

export default Function
