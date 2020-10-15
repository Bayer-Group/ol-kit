const vorpal = require('vorpal')()

const chalk = require('chalk')
const cliInput = require('./cliInput')
const RootDirController = require('./RootDirController')
const generator = require('./generate')

class Prompt {
  constructor (vorpalInstance) {
    this.vorpalInstance = vorpalInstance
    this.getProjectDirectoryName = this.getProjectDirectoryName.bind(this)
    this.finish = this.finish.bind(this)

    return this
  }

  getProjectDirectoryName () {
    function setProjectDirectory (projectDirectory, resolve) {
      cliInput.set('projectDirectory', projectDirectory)
      resolve()
    }

    return new Promise((resolve, reject) => {
      this.vorpalInstance.prompt({
        type: 'input',
        name: 'projectDirectory',
        default: 'ol-kit-map',
        message: `Project Directory Name (Spaces 👎 ): `
      }, (res) => {
        const { projectDirectory } = res
        const rootDir = new RootDirController(projectDirectory)

        if (rootDir.has()) {
          this.clobberCheck(projectDirectory).then((clobber) => {
            if (clobber) {
              setProjectDirectory(projectDirectory, resolve)
            }
          })
        } else {
          setProjectDirectory(projectDirectory, resolve)
        }
      })
    }).catch((err) => console.log(err))
  }

  finish () {
    return new Promise((resolve, reject) => {
      this.vorpalInstance.prompt({
        type: 'confirm',
        name: 'generate',
        message: `\n Generate project with options -> \n
          Project Directory: ${cliInput.get('projectDirectory')}.
        `,
        default: true
      }, (res) => {
        if (res.generate) {
          console.log('  ')
          console.log(chalk.cyan('🛠  Building...'))
          console.log('  ')

          generator.run()
        } else {
          console.log('Exiting')
        }
      })
    }).catch((err) => console.log(err))
  }

  clobberCheck (projectDirectory) {
    return new Promise((resolve, reject) => {
      console.error(chalk.red(`Directory /${projectDirectory}) already exists, please pick a new directory name`))
    }).catch((err) => console.log(err))
  }
}

let prompt

vorpal
  .command('map', 'Generates new base ol-kit project')
  .action(function () {
    prompt = new Prompt(this)
  })
  .cancel(function () {
    process.exit(1)
 })

vorpal
  .delimiter('ol-kit:')
  .show()

vorpal.exec('map')

module.exports = prompt
