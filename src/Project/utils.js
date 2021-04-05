import Map from 'ol/Map'
import ugh from 'ugh'

/**
 * A utility that takes map state and outputs it as a project file
 * @function
 * @category Project
 * @since 1.9.0
 * @param {Map} - a reference to openlayers map
 * @returns {File} - a JSON file in ol-kit project format
 */
export async function createProject (map) {
  if (!(map instanceof Map)) return ugh.throw('\'createProject\' requires a valid openlayers map as the first argument')

  const outputFile = 'THIS IS A PROJECT FILE!'

  return outputFile
}
