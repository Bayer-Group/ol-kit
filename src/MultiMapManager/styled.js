import styled from 'styled-components'

export const FlexMap = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  max-width: ${p => {
    const adjustedColumns = p.numberOfColumns - (p.total % 2)
    const breakPoint = p.index < adjustedColumns

    return !(p.total % 2) || !breakPoint ? `${100/p.numberOfColumns}%` : `${100/adjustedColumns}%`
  }};
  max-height: ${p => `${100/p.numberOfRows}%`};
  flex-grow: ${p => !p.index && (p.total % 2) ? '2' : '1'};
  flex-shrink: ${p => !p.index && (p.total % 2) ? '1' : '3'};
`

export const FullScreenFlex = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: hidden;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  align-content: flex-start;
  display: flex;
`

// ${props => {
//   const { index, total, numberOfRows = 2, numberOfColumns = 2 } = props
//   const isOdd = total % 2
//   const height = total > 2 ? `${100/(total/numberOfColumns)}%` : '100%'
//   const width = total > 2 ? `${100/(total/numberOfRows)}%` : '100%'

//   if (isOdd) {
//     if (index === 0) {
//       // make first map largest when total number is odd
//       return { height, width: '100%' }
//     } else {
//       return { height, width }
//     }
//   } else {
//     return { height, width }
//   }
// }}
// ${p => p.style};
