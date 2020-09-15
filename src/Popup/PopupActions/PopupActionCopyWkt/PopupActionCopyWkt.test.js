import React from 'react'
import { mount } from 'enzyme'

import olFormatWkt from 'ol/format/WKT'

import { Map } from 'Map'
import { PopupActionCopyWkt, convertFeatureToWkt } from 'Popup/PopupActions/PopupActionCopyWkt'

describe('<PopupActionWkt />', () => {
  it('should render given a feature', (done) => {
    const wkt = 'POLYGON((10.689 -25.092, 34.595 ' +
    '-20.170, 38.814 -35.639, 13.502 ' +
    '-39.155, 10.689 -25.092))'

    const format = new olFormatWkt()

    const feature = format.readFeature(wkt, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857'
    })

    mount(<Map><PopupActionCopyWkt feature={feature} /></Map>)

    done()
  })

  it('convert should convert a feature to WKT string', () => {
    const wkt = 'POLYGON((10.689 -25.092, 34.595 ' +
    '-20.170, 38.814 -35.639, 13.502 ' +
    '-39.155, 10.689 -25.092))'

    const format = new olFormatWkt()

    const feature = format.readFeature(wkt, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857'
    })

    const result = convertFeatureToWkt(feature, 5)

    expect(result).toBe('POLYGON((10.689 -25.092,34.595 -20.17,38.814 -35.639,13.502 -39.155,10.689 -25.092))')
  })
})
