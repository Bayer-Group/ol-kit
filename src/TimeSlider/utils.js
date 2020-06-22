// these are faster and more native than using momentjs
export const datesSameDay = (first, second) =>
  (!first || !second) ? false : (
    first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate())

export const datesDiffDay = (first, second) => !datesSameDay(first, second)