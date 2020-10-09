const vorpal = require('vorpal')()

const chalk = require('chalk')
const cliInput = require('./cliInput')
const RootDirController = require('./RootDirController')
const generator = require('./generate')

class Prompt {
  constructor (vorpalInstance) {
    this.vorpalInstance = vorpalInstance

    // this.getTeamName = this.getTeamName.bind(this)
    this.getAppName = this.getAppName.bind(this)
    // this.getAppHomepage = this.getAppHomepage.bind(this)
    this.getProjectDirectoryName = this.getProjectDirectoryName.bind(this)
    // this.getDescription = this.getDescription.bind(this)
    // this.getKeywords = this.getKeywords.bind(this)
    // this.getGitRepoUrl = this.getGitRepoUrl.bind(this)
    this.finish = this.finish.bind(this)

    return this
  }
  getTeamName () {
    return new Promise((resolve, reject) => {
      this.vorpalInstance.prompt({
        type: 'input',
        name: 'teamName',
        message: `Team name (Spaces 👍 ): `
      }, (res) => {
        const name = res.teamName

        const newAppVariables = Object.assign({}, {
          '__Team_NAME__': name,
          '__COOKIE_NAME__': name.split(' ').join('-').toLowerCase()
        }, cliInput.get('appVariables'))

        cliInput.set('appVariables', newAppVariables)
        cliInput.set('teamName', name)
        cliInput.set('pkgAppName', name.toLowerCase().split(' ').join('-'))

        resolve()
      })
    }).catch((err) => console.log(err))
  }

  getAppName () {
    return new Promise((resolve, reject) => {
      this.vorpalInstance.prompt({
        type: 'input',
        name: 'appName',
        message: `App name (Spaces 👍 ): `
      }, (res) => {
        const name = res.appName

        const newAppVariables = Object.assign({}, {
          '__APP_NAME__': name,
          '__COOKIE_NAME__': name.split(' ').join('-').toLowerCase()
        }, cliInput.get('appVariables'))

        cliInput.set('appVariables', newAppVariables)
        cliInput.set('appName', name)
        cliInput.set('pkgAppName', name.toLowerCase().split(' ').join('-'))

        resolve()
      })
    }).catch((err) => console.log(err))
  }

  getAppHomepage () {
    return new Promise((resolve, reject) => {
      this.vorpalInstance.prompt({
        type: 'input',
        name: 'appHomepage',
        message: `App Homepage (e.g. "/__my_cool_mapping_app__"): `
      }, (res) => {
        let homepage = res.appHomepage.split(' ').join('-')

        if (homepage.charAt(0) !== '/') {
          homepage = `/${homepage}`
        }

        const newAppVariables = Object.assign({}, {
          '__APP_HOMEPAGE__': homepage
        }, cliInput.get('appVariables'))

        cliInput.set('appVariables', newAppVariables)
        cliInput.set('appHomepage', homepage)
        resolve()
      })
    }).catch((err) => console.log(err))
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

  // getDescription () {
  //   return new Promise((resolve, reject) => {
  //     this.vorpalInstance.prompt({
  //       type: 'input',
  //       name: 'projectDescription',
  //       message: `Project Description: `
  //     }, (res) => {
  //       cliInput.set('projectDescription', res.projectDescription || '')
  //       resolve()
  //     })
  //   }).catch((err) => console.log(err))
  // }

  // getKeywords () {
  //   return new Promise((resolve, reject) => {
  //     this.vorpalInstance.prompt({
  //       type: 'input',
  //       name: 'projectKeywords',
  //       message: `Keywords (comma delimited): `
  //     }, (res) => {
  //       let keywords = res.projectKeywords || ''

  //       keywords = keywords.split(',').map((key) => key.trim())
  //       keywords.push('atlas', 'velocity-map-framework', 'vmf')

  //       cliInput.set('projectKeywords', keywords)
  //       resolve()
  //     })
  //   }).catch((err) => console.log(err))
  // }

  // getGitRepoUrl () {
  //   return new Promise((resolve, reject) => {
  //     this.vorpalInstance.prompt({
  //       type: 'input',
  //       name: 'gitRepoUrl',
  //       message: `Git Repo Url: `
  //     }, (res) => {
  //       cliInput.set('gitRepoUrl', res.gitRepoUrl || '')
  //       resolve()
  //     })
  //   }).catch((err) => console.log(err))
  // }

  finish () {
    return new Promise((resolve, reject) => {
      this.vorpalInstance.prompt({
        type: 'confirm',
        name: 'generate',
        message: `\n Generate project with options -> \n
          App: ${cliInput.get('appName')}
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
      this.vorpalInstance.prompt({
        type: 'confirm',
        name: 'clobber',
        message: `Directory (/${projectDirectory}) already exists, replace it?`,
        default: false
      }, (res) => {
        resolve(res.clobber)
      })
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
