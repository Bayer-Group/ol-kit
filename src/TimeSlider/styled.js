import styled from 'styled-components'

export const Container = styled.div.attrs({
  className: '_popup_boundary'
})`
  bottom: 40px;
  left: calc(50vw - 325px);
  position: absolute;
  transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, height 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, left 0.5s;
  width: 750px;
  opacity: .87;
`

export const LayerTitle = styled.div`
  margin-bottom: 10px;
`

export const HighlightedRange = styled.div`
  height: 100%;
  background: rgba(0, 250, 0, 0.5);
  position: absolute;
  border-right: 4px solid #00fa00;
  border-left: 4px solid #00fa00;
  left: ${props => `${props.left}px`};
  width: ${(props) => `${props.width}px`};
  right: ${props => `${props.right}px`};
  top: 0px;
`

export const ScrollContainer = styled.div`
  overflow-x: visible;
  overflow-y: hidden;
  width: 100%;
  height: 100%;
  position: relative;
`

export const BarContainer = styled.div`
  width: 100%;
  height: 38px;
  position: relative;
  overflow: hidden;

  &:hover {
    cursor: col-resize;
  }
`

export const DateContainer = styled.div`
  padding: 0 12px;
  display: inline-flex;
  user-select: none;
  width: 100%;
  min-height: 20px;
`

export const MarkContainer = styled.div`
  padding: 0 12px;
  display: inline-flex;
  width: 100%;
`

export const DateMark = styled.div`
  left: ${props => `${props.left}px`};
  width: ${props => `${props.width}px`};
  top: inherit;
  justify-content: start;
  font-size: 13px;
  font-weight: 700;
  color: #9f9f9f;
  position: absolute;
  display: flex;
`

export const BottomContainer = styled.div`
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const TimesliderBar = styled.div`
  background: #3e3e3e;
  position: absolute;
  border-radius: 5px;
  height: ${props => props.barHeight ? `${props.barHeight}px` : '2px'};
  top: ${props => `${props.barPlacement}px`};
  width: 100%;
`

export const Tickmark = styled.div`
  height: 30px;
  background: ${props => props.selected ? 'white' : props.tickColor || '#1440ce'};
  position: absolute;
  top: 2px;
  width: 3px;
  border-radius: 5px;
  z-index: ${props => props.selected ? '99' : '98'};
  border: solid ${props => props.selected ? '2px cyan' : '1px #ffffff'};
`

export const TimeSliderControls = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  bottom: 5px;
`

export const Marks = styled.div`
  top: 59px;
  width: 100%;
`

export const Buttons = styled.button`
  background: rgb(227, 227, 227);
  margin-right: ${props => props.marginRight ? `${props.marginRight}px` : ''};
  font-size: 13px;
  font-weight: 700;
  color: rgb(97, 97, 97);
`

export const TooManyForPreview = styled.div`
  margin-top: 15px;
  padding: 5px;
  border-radius: 5px;
  background: #fff3bf;
  text-align: center;
  color: #916d00;
`
