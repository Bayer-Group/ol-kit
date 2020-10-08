const chalk = require('chalk')
const cliInput = require('./cliInput')
const RootDirController = require('./RootDirController')
const packageMerge = require('./packageMerge')
const exec = require('child-process-promise').exec
const depcheck = require('depcheck')
const path = require("path")
const babelConfig = require('../../babel.config.js')
///Users/elaxx/projects/ol-kit/.eslintrc.json
module.exports = {
  run: async () => {
    const projectDir = cliInput.get('projectDirectory')
    const rootDir = new RootDirController(projectDir)
    let peerDepInstall
    // Create directory for new implementing application
    if (!rootDir.has()) rootDir.make()

    return new Promise( async (resolve, reject) => {
      // Clone vmap directory into new implementing application
      console.log(chalk.cyan(`    Cloning ol-kit files into /${projectDir}`))
      return exec(`git clone https://github.com/MonsantoCo/ol-kit.git ./${projectDir}`) 
      .then(() => {
        // If our peer dependencies ship a breaking change this will need to be addressed.
        const peerDependencies = require(`${rootDir.projectPath}/package.json`).peerDependencies
        peerDepInstall = Object.keys(peerDependencies).join(' ')
        return peerDepInstall
      })
      .then((peerDepInstall) => {
        console.log(chalk.cyan(`    Installing dependencies...(This may take a while)`))
        return exec(`cd ./${projectDir} && 
        find . -depth -mindepth 1 \! -path "./app/demos/world/*" \! -path "./app/demos/world" -delete && 
        mv app/demos/world/App.js . && 
        rm -rf app && npm init -y &&
        npm install ${peerDepInstall} --save`)
      })
      .then(() => {
        return depcheck(path.resolve(`./${projectDir}`), {}, (unused) => {
          const missingDependencies = Object.keys(unused.missing).join(' ')
          return exec(`cd ${projectDir}; npm install ${missingDependencies} --save`, () => {
            console.log(chalk.cyan('🌏  Success!'))
            console.log(chalk.cyan('🗺  Get started ->'))
            console.log(chalk.green(`    $ cd ${projectDir}`))
            console.log(chalk.green('    $ npm run start'))
            console.log('   ')
          })
        })
      })
      .catch((err) => {
        console.log(chalk.red('Something went wrong: ', err))
      })
    })
  }
}
