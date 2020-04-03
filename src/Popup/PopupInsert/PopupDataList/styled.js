import styled from 'styled-components'

/** @component */
export const Container = styled.div`
  position: relative;
  padding: 20px;
  overflow-y: auto;
  font-size: 13px;

  ::-webkit-scrollbar {
    display: none;
  }
`

/** @component */
export const Row = styled.div`
  color: #787878;
  margin: 0 0 15px 0;
  max-height: 200px;
`

/** @component */
export const Key = styled.div`
  display: block;
`

/** @component */
export const Value = styled.div`
  display: -webkit-box;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-height: 1.5;
  overflow: hidden;
  padding: 1px;
`
