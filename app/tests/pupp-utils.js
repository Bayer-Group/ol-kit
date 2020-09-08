// const colors = require('colors')

// // puppeteer helpers
// module.exports.waitAndClick = async function waitAndClick (page, datatestid) {
//   await page.waitForSelector(`[data-testid="${datatestid}"]`)
//   await page.waitFor(500)
//   console.info(` - clicking data-testid ${datatestid}`.blue) // eslint-disable-line no-console
//   await page.click(`[data-testid="${datatestid}"]`)
// }

// module.exports.assertWithInfo = function assertWithInfo (msg, assertion, ...args) {
//   try {
//     assertion(...args)
//     console.info(`    ✓ asserting ${msg}`.green) // eslint-disable-line no-console
//   } catch (err) {
//     console.info(`    x asserting ${msg}`.red) // eslint-disable-line no-console
//     process.exit()
//   }
// }

// module.exports.drawPolygon = async function drawPolygon (page, map = 0, start = [500, 300], size = 700) {
//   await page.mouse.move(start[0], start[1])
//   await page.waitFor(1000)
//   await page.mouse.down()
//   await page.mouse.up()

//   await page.mouse.move(start[0], start[1] + size / 2)
//   await page.waitFor(1000)
//   await page.mouse.down()
//   await page.mouse.up()

//   await page.mouse.move(start[0] + size / 2, start[1] + size / 2)
//   await page.waitFor(1000)
//   await page.mouse.down()
//   await page.mouse.up()

//   await page.mouse.move(start[0] + size / 2, start[1] - 100)
//   await page.waitFor(1000)
//   await page.mouse.down()
//   await page.mouse.up()

//   await page.mouse.click(start[0], start[1], { clickCount: 2 })
// }

// module.exports.addDebugCSS = async function (page) {
//   await page.addStyleTag({
//     content: `*:hover {
//       outline: solid magenta 1px !important;
//     }
    
//     *:focus {
//       outline: solid cyan 3px !important;
//     }
    
//     *:active {
//       outline: solid yellow 5px !important;
//     }`
//   })
// }
