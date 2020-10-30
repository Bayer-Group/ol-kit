import styled from 'styled-components'

export const AddNew = styled.span`
  display: inline-flex;
  align-items:center;
  color: #152357;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  padding: 25px 15px 0 15px;

  &:hover {
    color: #054d94;
  }
`

export const Card = styled.div`
  margin: 10px;
  padding: 10px 0;
  border-radius: 5px;
  background: #ffffff;
  box-shadow: 0px 2px 28px rgba(0, 0, 0, 0.04), 0px 5px 10px rgba(0,0,0,0.1);
`

export const StyleContainer = styled.div`
  display: flex;
  align-items: center;
  padding-right: 10px;
`

export const AttributeContainer = styled.div`
  display: flex;
`

export const Half = styled.div`
  flex: 1;
  align-items: flex-end;
`

export const DeleteGroup = styled.div`
  text-align: right;
  margin: 20px 22px;
`

export const DeleteGroupText = styled.span`
  cursor: pointer;
  color: #1b78d2;
  font-size: 14px;
  transition: all 0.15s ease-in-out;

  &:hover {
    color: #054d94;
  }
`

export const Trashcan = styled.div`
  color: #c3c3c3;
  font-size: 1.5em;
  vertical-align: top;
  display: flex;
  justify-content: center;
  cursor: pointer;
  margin-top: 15px;
  transition: all 0.15s ease-in-out;

  &:hover {
    color: #9a9a9a;
  }
`
