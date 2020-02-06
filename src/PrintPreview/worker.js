export function onmessage (msg) {
  if (!msg.data) return // if no data is sent, do nothing
  const { innerWidth, innerHeight, width, height, xOffset, yOffset, padding } = msg.data

  if (!width || !height) return self.postMessage({ scaledWidth: 0, scaledHeight: 0, center: [0, 0] }) // if height or width aren't passed, stop and message the main thread
  const [iWidth, iHeight] = [innerWidth - xOffset, innerHeight - yOffset] // adjust the screen dimensions by the x and y offsets

  let scalar = 0

  // While either dimension multiplied by the next iteration of the scale factor is less than the window bounds (after accounting for the offsets) -> add 0.1 to the existing scale factor
  while ((width * (scalar + 0.01)) < iWidth && (height * (scalar + 0.01)) < iHeight) scalar += 0.01

  // Multiply the original height and width by the scale factor
  const scaledWidth = (width * scalar) - padding
  const scaledHeight = (height * scalar) - padding

  // The top and left are pixel porsitions for the center of the preview so we add the X and Y offsets to the overal dimensions and divide by two.
  const top = (innerHeight + yOffset) / 2
  const left = (innerWidth + xOffset) / 2
  const center = [left, top]

  self.postMessage({ scaledWidth, scaledHeight, center })
}
