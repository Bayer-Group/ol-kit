import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Container, Key, Row, Value } from './styled'

/**
 * @component
 * @category Popup
 * @example ./example.md
 */
class PopupDataList extends Component {
  render () {
    const { attributes } = this.props

    const notGeom = key => !['geom', 'geometry'].includes(key.toLowerCase())

    return (
      <Container>
        {Object.keys(attributes).filter(notGeom).map(key => (
          <Row key={key}>
            <Key>{key}:</Key>
            <Value>{`${attributes[key]}` /* This trick converts values to strings */}</Value>
          </Row>
        ))}
      </Container>
    )
  }
}

PopupDataList.propTypes = {
  /** An object of stringify-able key/value pairs */
  attributes: PropTypes.object.isRequired
}

export default PopupDataList
