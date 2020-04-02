import styled from 'styled-components'

/** @component */
export const Container = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-end;
`

/** @component */
export const DeleteAll = styled.div`
  font-size: 10px;
  color: #152357;
  text-align: center;
  cursor: pointer;
`

/** @component */
export const Half = styled.div`
  flex: 1;
`

/** @component */
export const Fourth = styled.div`
  display: flex;
  flex-direction: column;
  width: 15%;
  vertical-align: top;
`

/** @component */
export const Title = styled.div`
  font-size: 10px;
  /* text-transform: uppercase; */
  color: ${props => props.color ? props.color : '#ccc'};
  text-align: center;
`
