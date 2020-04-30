class Ugh {
  error = (...args) => {
    // use this to log an error to the console (use .throw to throw error & stop code execution)
    // to drop this logger in a promise chain use: .catch(ugh.error)
    console.error(...args) // eslint-disable-line
  }

  throw = (message, reject) => {
    // throw an error to stop code execution or optionally fire reject callback for promises
    if (typeof reject === 'function') {
      // this is used within promises to reject the promise
      reject(message)
    } else {
      throw new Error(message)
    }
  }

  warn = (message, resolve) => {
    if (process.env.NODE_ENV !== 'test') console.warn(message) // eslint-disable-line

    // this is used within promises to resolve & continue the promise chain
    if (typeof resolve === 'function') resolve()
  }
}

export default new Ugh()
