const chalk = require('chalk')
const cliInput = require('./cliInput')
const RootDirController = require('./RootDirController')
const packageMerge = require('./packageMerge')
const exec = require('child-process-promise').exec
const depcheck = require('depcheck')
const path = require("path")
module.exports = {
  run: async () => {
    const projectDir = cliInput.get('projectDirectory')
    const rootDir = new RootDirController(projectDir)
    let peerDepInstall = ''
    // Create directory for new implementing application
    if (!rootDir.has()) rootDir.make()
    return new Promise( async (resolve, reject) => {
      // Clone ol-kit directory into new implementing application
      console.log(chalk.cyan(`    Cloning ol-kit files into /${projectDir}`))
      return exec(`git clone --single-branch --branch cli https://github.com/MonsantoCo/ol-kit.git ./${projectDir}`)
      .then(() => {
        // If our peer dependencies ship a breaking change this will need to be addressed.
        const peerDependencies = require(`${rootDir.projectPath}/package.json`).peerDependencies
        // installing only major packages eg. if >=5.2.3 we will install package@5
        for (const [package, version] of Object.entries(peerDependencies)) {
          peerDepInstall += `${package}@${version.split('.')[0].replace(/\D/g,'')} `
        }
        return peerDepInstall
      })
      .then(() => {
        console.log(chalk.cyan(`    Configuring Map...(This may take a while)`))
        // remove everything except app/demos/world/*
        return exec(`cd ./${projectDir} && 
        find . -depth -mindepth 1 \! -path "./app/demos/world/*" \! -path "./app/demos/world" \! -delete &&
        mkdir temp &&
        mv -v ./app/demos/world/* ./temp/ &&
        rm -rf app &&
        create-react-app ./react-temp &&
        mv -v ./react-temp/* .
        find . -depth -mindepth 1 \! -path "./node_modules/*" \! -path "./public/index.html" \! -path "./src" \! -path "./.gitignore" \! -path "./package*" \! -path "./temp/*" -delete &&
        rm ./public/index.html
        mv ./temp/index.html ./public/
        mv ./temp/favicon.ico ./public/
        mv -v ./temp/* ./src/ &&
        rm -rf temp react-temp`)
      })
      .then(() => {
        //check dependencies to see if there are any missing then install them
        return depcheck(path.resolve(`./${projectDir}`), {}, (unused) => {
          const missingDependencies = Object.keys(unused.missing).join(' ')
          const usedDependencies = Object.keys(unused.using).join(' ')
          console.log(chalk.cyan(`    Installing Dependencies...(This also may take a while)`))
          return exec(`cd ${projectDir}; npm install ${missingDependencies} ${peerDepInstall} ${usedDependencies} --save`, () => {
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