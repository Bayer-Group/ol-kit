const puppeteer = require('puppeteer')
const assert = require('assert')

const { waitAndClick, assertWithInfo, drawPolygon, addDebugCSS } = require('./pupp-utils')

;(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    devtools: true

  })
  const page = await browser.newPage()

  await page.setViewport({ width: 1800, height: 900 })
  await page.goto('http://localhost:3000/?view=39.074148,-94.513646,9.66,0.00')
  await addDebugCSS(page)

  await page.waitForSelector('[data-testid="Draw.container"]')

  await waitAndClick(page, 'Draw.polygon')
  await drawPolygon(page, 0, [500, 300], 700)

  const titles = (await page.evaluate(() => window.map.getLayers().getArray().map(l => l.get('title'))))

  assertWithInfo('layer titles match', assert.deepEqual, titles, [ null, "Diltz' House", 'Data Layer', 'Annotations' ])

  const features = await page.evaluate(() => {
    const lyr = window.map.getLayers().getArray()[3]
    const fts = lyr.getSource().getFeatures()

    return fts.length
  })

  assertWithInfo('Polygon draw success', assert.deepEqual, features, 1)

  await browser.close()
})()
