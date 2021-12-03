import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connectToContext } from 'Provider'
import { FlexMapStyled } from './styled'

class FlexMap extends React.Component {
  render () {
    const { children, index, maps, numberOfColumns, numberOfRows, total: totalProp, visibleState } = this.props
    const columns = numberOfColumns || visibleState.filter(_=>_).length
    const rows = numberOfRows || visibleState.filter(_=>_).length
    const total = totalProp || maps.length
  
    console.log('FlexMap render')
  
    return <FlexMapStyled columns={columns} index={index} rows={rows} total={total}>{children}</FlexMapStyled>
  }
}

FlexMap.defaultProps = {
  maps: [],
  numberOfColumns: 0,
  numberOfRows: 0,
  total: 0,
  visibleState: []
}

FlexMap.propTypes = {
  index: PropTypes.number,
  maps: PropTypes.array,
  numberOfColumns: PropTypes.number,
  numberOfRows: PropTypes.number,
  total: PropTypes.number,
  visibleState: PropTypes.array
}

export default FlexMap