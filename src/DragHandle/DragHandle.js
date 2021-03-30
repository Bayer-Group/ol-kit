import React from 'react'
import PropTypes from 'prop-types'
import { DragHandleIcon } from '../Popup/styled'

export default function DragHandle (props) {
  const { color, height, className } = props

  return (
    <DragHandleIcon color={color} height={height} className={className}>
      <svg width='65px' height='7px' viewBox='0 0 32 7' version='1.1' xmlns='http://www.w3.org/2000/svg' >
        <title>Drag icon</title>
        <g stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
          <g id='2' transform='translate(-704.000000, -63.000000)' fill='#C1C1C1'>
            <g id='Bottom-Sheet' transform='translate(0.000000, 59.000000)'>
              <g id='sheet-actions' transform='translate(704.000000, 4.000000)'>
                <g id='Drag-icon'>
                  <rect id='Rectangle' x='0' y='0' width='32' height='2' rx='1'></rect>
                  <rect id='Rectangle-Copy-4' x='0' y='5' width='32' height='2' rx='1'></rect>
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>
    </DragHandleIcon>
  )
}

DragHandle.defaultProps = {
  color: 'grey',
  height: '7px',
  className: 'handle'
}

DragHandle.propTypes = {
  color: PropTypes.string,
  height: PropTypes.string,
  className: PropTypes.string
}
