import styled from 'styled-components'


export const Container = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-end;
`


export const DeleteAll = styled.div`
  font-size: 10px;
  color: #152357;
  text-align: center;
  cursor: pointer;
`


export const Half = styled.div`
  display: flex;
  flex: 1;
`


export const Fourth = styled.div`
  display: flex;
  flex-direction: column;
  width: 15%;
  vertical-align: top;
`


export const Title = styled.div`
  font-size: 10px;
  /* text-transform: uppercase; */
  color: ${props => props.color ? props.color : '#ccc'};
  text-align: center;
`
