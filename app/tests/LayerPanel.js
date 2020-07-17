const puppeteer = require('puppeteer')
const assert = require('assert')
const { assertWithInfo, addDebugCSS } = require('./pupp-utils')

;(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 250
  })
  const page = await browser.newPage()
  await addDebugCSS(page)

  await page.goto('http://localhost:3000/?view=-7.156636,-112.500000,1.00,0.00')

  await page.setViewport({ width: 1013, height: 939 })

  // Open the layerpanel
  await page.waitForSelector('[data-testid="LayerPanel.open"] > path')
  await page.click('[data-testid="LayerPanel.open"] > path')

  try {
    await page.waitForSelector('[data-testid="LayerPanel.page"]', { timeout: 2000 })
    assertWithInfo('LayerPanel rendered', assert.equal, true, true)
  } catch (error) {
    assertWithInfo('LayerPanel rendered', assert.equal, false, true)
  }

  const layersLength = await page.evaluate(() => {
    return window.map.getLayers().getArray().length
  })

  assertWithInfo('number of layers', assert.equal, layersLength, 3)

  await page.waitForSelector('.smooth-dnd-draggable-wrapper:nth-child(1) [data-testid="LayerPanel.actionsButton"]')
  await page.click('.smooth-dnd-draggable-wrapper:nth-child(1) [data-testid="LayerPanel.actionsButton"]')

  try {
    await page.waitForSelector('[data-testid="LayerPanel.menu"]', { timeout: 2000 })
    assertWithInfo('LayerPanelMenu rendered', assert.equal, true, true)
  } catch (error) {
    assertWithInfo('LayerPanelMenu rendered', assert.equal, false, true)
  }

  const mapExtent = await page.evaluate(() => {
    return window.map.getView().calculateExtent()
  })

  await page.waitForSelector('[data-testid="LayerPanelAction.extent"]')
  await page.click('[data-testid="LayerPanelAction.extent"]')

  const newMapExtent = await page.evaluate(() => {
    return window.map.getView().calculateExtent()
  })

  assertWithInfo('The map moved extent', assert.notDeepEqual, mapExtent, newMapExtent)

  await page.waitForSelector('.smooth-dnd-draggable-wrapper:nth-child(1) [data-testid="LayerPanel.expandLayer"] > path')
  await page.click('.smooth-dnd-draggable-wrapper:nth-child(1) [data-testid="LayerPanel.expandLayer"] > path')

  try {
    await page.waitForSelector('[data-testid="LayerPanel.feature0"]', { timeout: 2000 })
    assertWithInfo('LayerPanel features expanded', assert.equal, true, true)
  } catch (error) {
    assertWithInfo('LayerPanel features expanded', assert.equal, false, true)
  }

  try {
    await page.waitForSelector('[data-testid="LayerPanel.feature1"]', { timeout: 2000 })
    assertWithInfo('LayerPanel expands only layer clicked', assert.notEqual, true, true)
  } catch (error) {
    assertWithInfo('LayerPanel expands only layer clicked', assert.notEqual, false, true)
  }

  await page.waitForSelector('.MuiList-root > .MuiListItem-root [data-testid="LayerPanel.checked"]')
  await page.click('.MuiList-root > .MuiListItem-root [data-testid="LayerPanel.checked"]')

  const visibleLayersLength = await page.evaluate(() => {
    return window.map.getLayers().getArray().filter(layer => layer.get('visible')).length
  })

  assertWithInfo('The checkbox hid the layer', assert.equal, 2, visibleLayersLength)

  try {
    await page.waitForSelector('[data-testid="LayerPanel.indeterminateCheckbox"]', { timeout: 2000 })
    assertWithInfo('Indeterminate checkbox rendered', assert.equal, true, true)
  } catch (error) {
    assertWithInfo('Indeterminate checkbox rendered', assert.equal, false, true)
  }

  await page.waitForSelector('.MuiList-root > .MuiListItem-root [data-testid="LayerPanel.unchecked"]')
  await page.click('.MuiList-root > .MuiListItem-root [data-testid="LayerPanel.unchecked"]')

  try {
    await page.waitForSelector('[data-testid="LayerPanel.indeterminateCheckbox"]', { timeout: 2000 })
    assertWithInfo('No indeterminate due to all layers visible', assert.notEqual, true, true)
  } catch (error) {
    assertWithInfo('No indeterminate due to all layers visible', assert.notEqual, false, true)
  }

  await page.waitForSelector('[data-testid="LayerPanel.collapseLayer"]')
  await page.click('[data-testid="LayerPanel.collapseLayer"]')

  try {
    await page.waitForSelector('[data-testid="LayerPanel.feature0"]', { timeout: 2000 })
    assertWithInfo('LayerPanel features collapsed', assert.notEqual, true, true)
  } catch (error) {
    assertWithInfo('LayerPanel features collapsed', assert.notEqual, false, true)
  }

  await page.waitForSelector('[data-testid="LayerPanel.masterActionsIcon"]')
  await page.click('[data-testid="LayerPanel.masterActionsIcon"]')

  try {
    await page.waitForSelector('[data-testid="LayerPanel.menu"]', { timeout: 2000 })
    assertWithInfo('LayerPanelMenu rendered', assert.equal, true, true)
  } catch (error) {
    assertWithInfo('LayerPanelMenu rendered', assert.equal, false, true)
  }

  await page.waitForSelector('[data-testid="LayerPanelAction.remove"]', { timeout: 2000 })
  await page.click('[data-testid="LayerPanelAction.remove"]')

  const newLayersLength = await page.evaluate(() => {
    return window.map.getLayers().getArray().length
  })

  assertWithInfo('LayerPanel Master Remove removes all layers', assert.equal, newLayersLength, 1)

  await page.waitForSelector('.MuiTab-wrapper > [data-testid="LayerPanel.close"]')
  await page.click('.MuiTab-wrapper > [data-testid="LayerPanel.close"]')

  try {
    await page.waitForSelector('[data-testid="LayerPanel.page"]', { timeout: 2000 })
    assertWithInfo('LayerPanel closed', assert.notEqual, true, true)
  } catch (error) {
    assertWithInfo('LayerPanel closed', assert.notEqual, false, true)
  }

  await browser.close()
})()
