import styled from 'styled-components'


export const Action = styled.div`
  cursor: pointer;
`


export const Item = styled.div`
  padding: 12px 15px;
  font-size: 15px;
  width: 100%;
  color: ${props => props.disabled ? 'gray' : 'black'};

  &:hover {
    background: #f2f2f2;
  }
`
