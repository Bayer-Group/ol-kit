import styled from 'styled-components'

export const PrimaryButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 5px;
  background: ${props => props.synced ? '#152357' : '#ededed'};
  color: ${props => props.synced ? '#ffffff' : '#424242'};
  font-weight: 600;
  flex-basis: ${props => props.grow ? '100%' : '45%'};
  flex-grow: 1;
  min-height: 45%;
  &:hover {
    background: ${props => props.synced ? '#2a3f8c' : '#d8d7d7'};
  }
  pointer-events: ${props => props.disabled ? 'none' : 'auto'};
`

export const LockIcon = styled.span`
  font-size: 35px;
`
