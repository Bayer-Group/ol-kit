import styled from 'styled-components'

export const Container = styled.div`
  position: relative;
  padding: 20px;
  overflow-y: auto;
  font-size: 13px;

  ::-webkit-scrollbar {
    display: none;
  }
`

export const Row = styled.div`
  margin: 0 0 15px 0;
  max-height: 200px;
`

export const Key = styled.div`
  color: #787878;
  text-transform: capitalize;
  display: block;
`

export const Value = styled.div`
  display: -webkit-box;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-height: 1.5;
  overflow: hidden;
  padding: 1px;
  font-weight: bold;
`
