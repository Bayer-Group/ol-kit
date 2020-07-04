import styled from 'styled-components'
import { connectToMap } from 'Map'

export const Header = connectToMap(styled.div`
  background-color: ${props => props.theme.palette.divider};
`)

export const HeaderDetails = connectToMap(styled.div`
  padding: 32px 20px ${p => JSON.parse(p.loading) ? '20px' : '0'} 20px;
  ${p => JSON.parse(p.loading) ? 'min-height: 105px' : 'min-height: 0px'};
  color: ${props => props.theme.palette.text.secondary}#787878;
`)

export const Body = styled.div`
  height: 100%;
`

export const Frame = connectToMap(styled.div`
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
    border: 2px solid ${props => props.theme.palette.background.paper}; /* should match background, can't be transparent */
    background-color: ${props => props.theme.palette.background.paper};
  }
`)

export const Title = connectToMap(styled.div`
  font-size: 17px;
  font-style: normal;
  color: ${p => p.theme.palette.text.primary};
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 2px 0;
  text-align: center;
`)

export const FeatureNavigator = connectToMap(styled.div`
  display: inline-block;
  position: absolute;
  top: 4px;
  color: ${p => p.theme.palette.text.secondary};
  vertical-align: middle;
  height: 22px;
  z-index: 1;
  right: 0;
  text-align: left;
  left: 4px;
`)

export const FeatureCount = styled.div`
  display: inline-block;
  vertical-align: inherit;
  line-height: 1px;
  user-select: none;
`

export const Close = connectToMap(styled.button`
  display: block;
  position: absolute;
  outline: none;
  height: 18px;
  width: 40px;
  cursor: pointer;
  top: 8px;
  right: 2px;
  background: none;
  border: none;
  z-index: 2;
  transition: .2s;
  color: ${p => p.theme.palette.action.active};
  &:hover {
    color: ${p => p.theme.palette.action.disabled}
  }
`)
