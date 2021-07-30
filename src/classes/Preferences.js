class Preferences {
  constructor () {
    this.state = {}
  }

  get (key) {
    const value = localStorage.getItem(key) || this.state[key]

    // checking to see if the localstorage value is 'true' or 'false' so we can cast to an actual bool
    if (value === 'true' || value === 'false') {
      return value === 'true'
    } else {
      return value
    }
  }

  async put (key, val) {
    localStorage.setItem(key, val)
    this.state = { ...this.state, [key]: val }

    return val
  }
}

export default Preferences
