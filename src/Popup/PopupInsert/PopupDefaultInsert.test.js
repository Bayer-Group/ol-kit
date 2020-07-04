import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import olFeature from 'ol/feature'
import olPoint from 'ol/geom/point'
import translations from 'locales/en'
import { createSelectInteraction } from 'Map'
import { PopupDefaultInsert } from 'Popup'

describe('<PopupDefaultInsert />', () => {
  it('should handle select change when paging', async () => {
    const selectInteraction = createSelectInteraction()
    const feature0 = new olFeature(new olPoint([0, 0]))
    const feature1 = new olFeature(new olPoint([10, 10]))
    const feature2 = new olFeature(new olPoint([20, 20]))

    feature2.setProperties({ title: 'custom title', property: 'custom property' })
    const features = [feature0, feature1, feature2]
    const onClose = jest.fn()

    const { getByTestId, getAllByText, getByText, unmount } = render(
      <PopupDefaultInsert
        features={features}
        selectInteraction={selectInteraction}
        translations={translations}
        onClose={onClose} />
    )

    let title = await getByText('Feature 1')

    let pageCount = await getByText('1 / 3')

    let rightArrow = await getByTestId('popup-page-right-arrow')

    // feature 0 should render with a default title
    expect(title).toBeTruthy()
    expect(pageCount).toBeTruthy()
    expect(selectInteraction.getFeatures().getArray()).toEqual([feature0])

    // click NEXT page
    fireEvent.click(rightArrow)

    title = await getByText('Feature 2')
    pageCount = await getByText('2 / 3')
    rightArrow = await getByTestId('popup-page-right-arrow')

    // feature 1 should render with a default title
    expect(title).toBeTruthy()
    expect(pageCount).toBeTruthy()
    expect(selectInteraction.getFeatures().getArray()).toEqual([feature1])

    // click NEXT page
    fireEvent.click(rightArrow)

    title = await getAllByText('custom title')
    const property = await getByText('custom property')

    pageCount = await getByText('3 / 3')
    const leftArrow = await getByTestId('popup-page-left-arrow')

    // feature 2 should render with a default title
    expect(title).toBeTruthy()
    expect(property).toBeTruthy()
    expect(pageCount).toBeTruthy()
    expect(selectInteraction.getFeatures().getArray()).toEqual([feature2])

    // click BACK page
    fireEvent.click(leftArrow)

    title = await getByText('Feature 2')
    pageCount = await getByText('2 / 3')
    const closeButton = await getByTestId('popup-page-close')

    // feature 1 should render with a default title
    expect(title).toBeTruthy()
    expect(pageCount).toBeTruthy()
    expect(selectInteraction.getFeatures().getArray()).toEqual([feature1])

    // click CLOSE
    fireEvent.click(closeButton)

    expect(onClose).toHaveBeenCalled()

    // unmount and check that last feature still selected
    unmount()

    expect(selectInteraction.getFeatures().getArray()).toEqual([feature1])
  })
})
