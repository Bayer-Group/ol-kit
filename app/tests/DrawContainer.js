const puppeteer = require('puppeteer')
const assert = require('assert')

const { waitAndClick, assertWithInfo, drawPolygon, addDebugCSS, drawRegularShape, drawBox } = require('./pupp-utils')

;(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    devtools: false
  })
  const page = await browser.newPage()

  await page.setViewport({ width: 1800, height: 900 })
  await page.goto('http://localhost:3000/?view=39.074148,-94.513646,9.66,0.00')
  await addDebugCSS(page)

  await page.waitForSelector('[data-testid="Draw.container"]')

  await waitAndClick(page, 'Draw.polygon')
  await drawPolygon(page, 0, [500, 300], 700)

  const titles = (await page.evaluate(() => window.map.getLayers().getArray().map(l => l.get('title'))))

  console.log(titles) // eslint-disable-line no-console

  assertWithInfo('layer titles match', assert.deepEqual, titles, [ null, "Diltz' House", 'Data Layer', 'Annotations' ])

  const features = () => page.evaluate(() => {
    const lyr = window.map.getLayers().getArray()[3]
    const fts = lyr.getSource().getFeatures()

    return fts.length
  })

  assertWithInfo('Polygon draw success', assert.deepEqual, await features(), 1)

  await waitAndClick(page, 'Draw.point')

  await page.mouse.move(550, 320)
  await page.waitFor(1000)
  await page.mouse.down()
  await page.mouse.up()

  assertWithInfo('Point draw success', assert.deepEqual, await features(), 2)

  await waitAndClick(page, 'Draw.box')
  await drawBox(page)

  assertWithInfo('Box draw success', assert.deepEqual, await features(), 3)

  await waitAndClick(page, 'Draw.circle')
  await drawBox(page)

  assertWithInfo('Circle draw success', assert.deepEqual, await features(), 4)

  await waitAndClick(page, 'Draw.line')

  await page.mouse.move(400, 260)
  await page.waitFor(1000)
  await page.mouse.down()
  await page.mouse.up()

  await page.mouse.move(400, 400)
  await page.waitFor(1000)
  await page.mouse.down()
  await page.mouse.up()

  await page.mouse.move(200, 400)
  await page.waitFor(1000)
  await page.mouse.down()
  await page.mouse.up()

  await page.mouse.click(200, 400, { clickCount: 2 })

  assertWithInfo('Line draw success', assert.deepEqual, await features(), 5)

  await browser.close()
})()
