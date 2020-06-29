const puppeteer = require('puppeteer')

const assert = require('assert')

const { assertWithInfo } = require('./pupp-utils')

// ;(async () => {
//   const browser = await puppeteer.launch({
//     headless: false
//   })
//   const page = await browser.newPage()

//   await page.goto('http://localhost:3000?view=39.074148,-94.513646,9.66,0.00', { timeout: 0 })
//   await page.setViewport({ width: 1200, height: 600 })

//   await page.waitFor(10000)

//   const layersLength = await page.evaluate(() => {
//     console.log(window.map.getLayers().getArray())

//     return window.map.getLayers().getArray().length
//   })

//   assertWithInfo('number of layers', assert.equal, layersLength, 3)

//   await browser.close()
// })();

;

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 250
  })
  const page = await browser.newPage()

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

  await page.waitForSelector('[data-testid="LayerPanelAction.extent"]')
  await page.click('[data-testid="LayerPanelAction.extent"]')

  const ditlzHouseExtent = await page.evaluate(() => {
    const ditlzHouse = window.map.getLayers().getArray().find(layer => layer.get('title') === 'Diltz\' House')

    return ditlzHouse.getSource().getExtent()
  })

  assertWithInfo('Extent of Diltz\' house', assert.deepEqual, ditlzHouseExtent, [
    -10012141.571002519,
    4710663.287391069,
    -10012141.571002519,
    4710663.287391069
  ])

  await page.waitForSelector('.smooth-dnd-draggable-wrapper:nth-child(1) [data-testid="LayerPanel.expandLayer"] > path')
  await page.click('.smooth-dnd-draggable-wrapper:nth-child(1) [data-testid="LayerPanel.expandLayer"] > path')

  await page.waitForSelector('.MuiList-root > .MuiListItem-root [data-testid="LayerPanel.checked"]')
  await page.click('.MuiList-root > .MuiListItem-root [data-testid="LayerPanel.checked"]')

  await page.waitForSelector('.MuiList-root > .MuiListItem-root [data-testid="LayerPanel.unchecked"]')
  await page.click('.MuiList-root > .MuiListItem-root [data-testid="LayerPanel.unchecked"]')

  await page.waitForSelector('[data-testid="LayerPanel.collapseLayer"]')
  await page.click('[data-testid="LayerPanel.collapseLayer"]')

  await page.waitForSelector('[data-testid="LayerPanel.masterActionsIcon"]')
  await page.click('[data-testid="LayerPanel.masterActionsIcon"]')

  await page.waitForSelector('[data-testid="LayerPanelAction.remove"]')
  await page.click('[data-testid="LayerPanelAction.remove"]')

  await page.waitForSelector('.MuiTab-wrapper > [data-testid="LayerPanel.close"]')
  await page.click('.MuiTab-wrapper > [data-testid="LayerPanel.close"]')

  await browser.close()
})()
