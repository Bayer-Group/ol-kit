const fs = require('fs')
const path = require('path')
const chalk = require('chalk')

class RootDirController {
  constructor (projectDirectory) {
    this.projectPath = path.resolve(`${process.cwd()}/${projectDirectory}`)

    this.resolve = this.resolve.bind(this)
    this.join = this.join.bind(this)
    this.writeFile = this.writeFile.bind(this)

    this.appConfigPath = '/config/appVars.js'
  }

  has () {
    return fs.existsSync(this.projectPath)
  }

  make () {
    fs.mkdirSync(this.projectPath)
  }

  join (file) {
    return path.join(this.resolve(), `/${file}`)
  }

  resolve () {
    return path.resolve(this.projectPath)
  }

  resolveAppConfigPath () {
    return path.resolve(this.join(this.appConfigPath))
  }

  writeFile (fileName, fileData) {
    return new Promise((resolve, reject) => {
      fs.writeFile(fileName, fileData, (err) => {
        if (err) {
          console.log(chalk.red(`Error writing ${fileName}:\n${err}`))

          return reject(err)
        }

        resolve(path.resolve(fileName))
      })
    })
  }
}

module.exports = RootDirController
