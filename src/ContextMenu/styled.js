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
  font-family: sans-serif;
  overflow: hidden;
  color: #494949;
`

export const ListItem = styled.div`
  padding: 10px;
  cursor: ${props => props.disabled ? 'default' : 'pointer'};
  color: ${props => props.disabled ? '#ccc' : '#000'};
  border-top: 1px solid #ebebeb;
  transition: all 0.15s ease-in;

  &:hover {
    color: ${props => props.disabled ? '#ccc' : '#fff'};
    background: ${props => props.disabled ? '#fff' : '#3f51b5'};
    transition: all 0.15s ease-out;
  }
`

export const CoordWrapper = styled.div`
  padding: 5px 0;
  font-size: 14px;
  transition: all 0.15s ease-in;

  &:hover {
    color: #fff;
    background: #3f51b5;
    transition: all 0.15s ease-out;
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
  font-weight: 600;
  letter-spacing: 0.5px;
  margin-right: 10px;
`

export const CoordRaw = styled.span`
  float: right;
`
