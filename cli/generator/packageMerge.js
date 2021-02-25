const fs = require('fs')
const path = require('path')
const cliInput = require('./cliInput')

function resolvePath (globalKey) {
  if (cliInput.get('projectDirectory')) {
    return path.resolve(`${cliInput.get('projectDirectory')}/package.json`)
  }
}

function parsePackageJson (path) {
  if (path) {
    return JSON.parse(fs.readFileSync(path, 'utf8'))
  }
}

module.exports = {
  toJson: (indentation = 2) => {
    const [corePackage] = ['corePath'].map(resolvePath).map(parsePackageJson)
    const implementingAppOptions = Object.assign({}, corePackage, {
      name: cliInput.get('pkgAppName'),
      version: '0.0.0',
      team: cliInput.get('teamName'),
      homepage: cliInput.get('appHomepage'),
      description: cliInput.get('projectDescription'),
      keywords: cliInput.get('projectKeywords'),
      repository: {
        type: 'git',
        url: cliInput.get('gitRepoUrl')
      }
    })

    

    return JSON.stringify(implementingAppOptions, null, indentation)
  }
}
