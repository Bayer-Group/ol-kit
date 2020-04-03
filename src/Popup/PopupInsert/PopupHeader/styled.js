import styled from 'styled-components'

/** @component */
export const Header = styled.div`
  background-color: #ededed;
`

/** @component */
export const HeaderDetails = styled.div`
  padding: 32px 20px ${props => props.loading ? '20px' : '0'} 20px;
  ${props => props.loading ? 'min-height: 105px' : 'min-height: 0px'};
  color: #787878;
`

/** @component */
export const Body = styled.div`
  height: 100%;
`

/** @component */
export const Frame = styled.div`
  height: ${props => props.height}px;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    -webkit-appearance: none;
  }

  &::-webkit-scrollbar:vertical {
    width: 11px;
  }

  &::-webkit-scrollbar:horizontal {
    height: 11px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 8px;
    border: 2px solid white; /* should match background, can't be transparent */
    background-color: rgba(0, 0, 0, .5);
  }
`

/** @component */
export const Title = styled.div`
  font-size: 17px;
  font-style: normal;
  color: #333333;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 2px 0;
  text-align: center;
`

/** @component */
export const FeatureNavigator = styled.div`
  display: inline-block;
  position: absolute;
  top: -4px;
  color: #787878;
  vertical-align: middle;
  height: 22px;
  z-index: 1;
  right: 0;
  text-align: left;
  left: 10px;
`

/** @component */
export const FeatureCount = styled.div`
  display: inline-block;
  vertical-align: inherit;
  line-height: 1px;
  user-select: none;
`

/** @component */
export const Close = styled.button`
  display: block;
  position: absolute;
  outline: none;
  top: 7px;
  right: 7px;
  background: none;
  border: none;
  z-index: 2;
  i {
    font-size: 1.5em;
    padding: 0;
  }
`
