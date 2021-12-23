import styled from 'styled-components'

export const Container = styled.div`
  padding: 0 1em 1em 1em;
`

export const MapDisplayContainer = styled.div`
  width: 240px;
  height: 150px;
  float: left;
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
`

export const ControlStylesContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  height: 150px;
`
export const MapControlButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 5px;
  height: 50px;
  width: 50px;
  border: 0px;
  background: transparent;
  color: rgb(0, 0, 0);
  font-size: 25px;

  &:disabled {
    color: #dedede;
    cursor: not-allowed;
  }
`
