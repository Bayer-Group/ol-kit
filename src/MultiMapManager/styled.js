import styled from 'styled-components'

export const FlexMap = styled.div`
  display: inline-flex;
  flex: 1;
  flex-grow: 1;
  ${props => {
    const { index, total, numberOfRows = 2, numberOfColumns = 2 } = props
    const isOdd = total % 2
    const height = total > 2 ? `${100/(total/numberOfColumns)}%` : '100%'
    const width = total > 2 ? `${100/(total/numberOfRows)}%` : '100%'

    if (isOdd) {
      if (index === 0) {
        // make first map largest when total number is odd
        return { height, width: '100%' }
      } else {
        return { height, width }
      }
    } else {
      return { height, width }
    }
  }}
  ${p => p.style};
`
// FlexMap.defaultProps = {
//   _ol_kit_multi: true
// }

export const FullScreenFlex = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  scroll: none;
  flex-wrap: wrap;
  align-items: flex-start;
  align-content: flex-start;
`
