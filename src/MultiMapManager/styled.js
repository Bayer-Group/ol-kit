import styled from 'styled-components'

export const FlexMap = styled.div`
  display: inline-flex;
  flex: 1;
  flex-grow: 1;
  ${props => {
    const { index, total } = props
    const isOdd = total % 2
    const height = total > 2 ? '50%' : '100%'

    if (isOdd) {
      if (index === 0) {
        // make first map largest when total number is odd
        return { height, width: '100%' }
      } else {
        return { height, width: '50%' }
      }
    } else {
      return { height, width: '50%' }
    }
  }}
  ${p => p.style};
`

export const FullScreenFlex = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  scroll: none;
  flex-wrap: wrap;
  align-items: flex-start;
  align-content: flex-start;
`
