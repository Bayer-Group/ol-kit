import olFormatFilter from 'ol/format/filter'
import ugh from 'ugh'

export function buildWfsFilters (filters) {
  const nullFilter = val => val

  if (filters && filters.length) {
    return [filters].map(([condition, valueMap]) => {
      const size = valueMap.size === 1 || [...valueMap.values()].filter(val => val.size).length === 1

      // this is to prevent having an 'AND' with only one condition which errors out in OL
      if (size && condition === 'AND') return flatten([...valueMap.entries()].map(buildWfsFilters))[0]
      switch (condition) {
        case 'AND':
          return olFormatFilter.and(...flatten([...valueMap.entries()].filter(nullFilter).map(buildWfsFilters)))
        case 'OR':
          return olFormatFilter.or(...flatten(...[...valueMap.entries()].filter(nullFilter).map(buildWfsFilters)))
        case 'NOT':
          return olFormatFilter.not(...flatten([...valueMap.entries()].filter(nullFilter).map(buildWfsFilters)))
        case 'IN':
          return olFormatFilter.or(...flatten(...[...valueMap.entries()]
            .filter(nullFilter)
            .map(([attribute, value]) => [...value.values()]
              .map(val => olFormatFilter.equalTo(attribute, val)))))
        case 'EQUALS':
          return [...valueMap.entries()].filter(nullFilter).map((params) => olFormatFilter.equalTo(...params))
        case 'INTERSECTS':
          return [...valueMap.values()].filter(nullFilter).map((paramArray) => {
            return olFormatFilter.intersects(...paramArray)
          })
        default:
          ugh.warn(`GeoserverLayer currently only supports 'AND', 'INTERSECTS', 'EQUALS', 'IN', and 'OR' conditions for WFS sources. ${condition} is not supported.`)
      }
    })[0]

  // the return type of this function is a string, either a filter or no filter
  } else {
    return ''
  }
}

export function flatten (array) {
  if (Array.prototype.flat && typeof Array.prototype.flat === 'function') return array.flat(Infinity)

  return array.reduce((flat, toFlatten) => {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten)
  }, [])
}
