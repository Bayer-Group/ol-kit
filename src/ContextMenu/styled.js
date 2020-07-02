import styled from 'styled-components'

export const Container = styled.div`
  top: ${props => parseInt(props.top)}px;
  left: ${props => parseInt(props.left)}px;
  display: ${props => props.show ? 'block' : 'none'};
  z-index: 9999;
  height: auto;
  width: 215px;
  position: absolute;
  background: #fff;
  border-radius: 3px;
  box-shadow: 3px 3px 15px 3px rgba(0, 0, 0, 0.15);
`

export const ListItem = styled.div`
  padding: 5px 10px;
  cursor: ${props => props.disabled ? 'default' : 'pointer'};
  color: ${props => props.disabled ? '#ccc' : '#000'};

  &:hover {
    color: ${props => props.disabled ? '#ccc' : '#fff'};
    background: ${props => props.disabled ? '#fff' : '#3f51b5'};
  }
`

export const CoordWrapper = styled.div`
  border-bottom: 1px solid #c6c6c6;
  
  &:hover {
    color: #fff;
    background: #3f51b5;
  }
`

export const CoordGroup = styled.div`
  padding: 5px 10px;
  overflow: auto;
  cursor: copy;
`

export const CoordTitle = styled.div`
  float: left;
  text-transform: uppercase;
  margin-right: 10px;
`

export const CoordRaw = styled.span`
  float: right;
`
