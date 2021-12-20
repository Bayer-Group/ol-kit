import React from 'react'
import PropTypes from 'prop-types'
import { connectToContext } from '../Provider/utils' // direct import required here!
import { FlexMapStyled } from './styled'

class FlexMap extends React.Component {
  render () {
    const { children, index, maps, numberOfColumns, numberOfRows, total, visibleState } = this.props
    const totalMaps = total || maps.length
    const visibleMapCount = visibleState.filter(_ => _).length
  
    let columns = numberOfColumns || (visibleMapCount % 2 === 1) ? 1 : 2
  
    const rows = numberOfRows || (visibleMapCount > 2) ? 2 : 1
    // 3 maps
  
    if (visibleMapCount === 3) {
      columns = index === 0 ? 1 : 2
    }
  
    // console.log('FlexMap index:', index, 'maps:', maps.length, 'columns:', columns, 'rows:', rows)
  
    return (
      <FlexMapStyled
        columns={columns}
        hidden={!visibleState[index]}
        index={index}
        numOfRows={rows}
        total={totalMaps}>
        {children}
      </FlexMapStyled>
    )
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

export default connectToContext(FlexMap)
