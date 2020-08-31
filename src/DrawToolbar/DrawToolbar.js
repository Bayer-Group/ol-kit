/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { Toolbar } from 'Toolbar'
import { withStyles } from '@material-ui/core/styles'
import MaterialSwitch from '@material-ui/core/Switch'
import { Card, Grid, CardActions, Button, FormControlLabel } from '@material-ui/core'

const ButtonCardActions = withStyles(() => ({
  root: {
    padding: '4px 4px 3px 4px'
  }
}))(CardActions)

const LeftCard = withStyles(() => ({
  root: {
    borderTopLeftRadius: '4px',
    borderBottomLeftRadius: '4px',
    borderBottomRightRadius: '0px',
    borderTopRightRadius: '0px',
    height: '38px'
  }
}))(Card)

const CenterCard = withStyles(() => ({
  root: {
   borderRadius: '0px',
   paddingLeft: '20px',
   marginLeft: '0px',
   height: '38px'
  }
}))(Card)

const RightCard = withStyles(() => ({
  root: {
    borderTopRightRadius: '4px',
    borderBottomRightRadius: '4px',
    borderTopLeftRadius: '0px',
    borderBottomLeftRadius: '0px',
    marginLeft: '0px !important',
    height: '38px'
  }
}))(Card)

const Switch = withStyles(() => ({
  switchBase: {
    color: '#152457',
    '&$checked': {
      color: '#152457'
    },
    '&$checked + $track': {
      backgroundColor: '#152457'
    }
  },
  checked: {},
  track: {}
}))(MaterialSwitch)

export class DrawToolbar extends React.Component {
  render () {
    const { translations, showMeasurements, onShowMeasurements, onCancel, onFinish } = this.props

    return (
      <Toolbar>
        <Grid item>
          <ButtonCardActions>
            <LeftCard>
              <Button color='secondary' onClick={onCancel}>
                {translations['_ol_kit.DrawToolbar.cancel']}
              </Button>
            </LeftCard>
            <CenterCard style={{ paddingLeft: '20px', marginLeft: '0px' }}>
              <FormControlLabel
                style={{ marginBottom: '0px' }}
                control={
                  <Switch
                    checked={showMeasurements}
                    onChange={onShowMeasurements}
                    color='primary'
                  />
                }
                label={translations['_ol_kit.DrawToolbar.showMeasurements']}
              />
            </CenterCard>
            <RightCard>
              <Button color='primary' onClick={onFinish}>
                {translations['_ol_kit.DrawToolbar.finish']}
              </Button>
            </RightCard>
          </ButtonCardActions>
        </Grid>
      </Toolbar>
    )
  }
}

DrawToolbar.propTypes = {
  onCancel: PropTypes.func,
  onFinish: PropTypes.func,
  translations: PropTypes.object,
  showMeasurements: PropTypes.bool,
  onShowMeasurements: PropTypes.func
}

DrawToolbar.defaultProps = {
  translations: {
    '_ol_kit.DrawToolbar.cancel': 'Cancel [ESC]',
    '_ol_kit.DrawToolbar.finish': 'Finish',
    '_ol_kit.DrawToolbar.showMeasurements': 'Show measurements'
  }
}

export default DrawToolbar
