import styled from 'styled-components'

export const AttributeSettings = styled.div`
  display: flex;
  padding: 15px 0px 0px 15px;
  align-items: center;
  color: #152357;

  &:hover {
    cursor: pointer;
    color: #0e659e;
  }
`

export const HeightContainer = styled.div.attrs(p => ({ 'data-testid': p['data-testid'] }))`
  height: 100%;
`
