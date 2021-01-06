const semver = require('semver')
const child_process = require('child_process')
const packageJson = require('./package.json')

const packageName = packageJson.name
const tag = packageJson.version.includes('-') ? 'next' : 'latest'
const latestVersion = child_process.execSync(`npm view ${packageName}@latest version`).toString()

// publish with a `shipping` tag so we can control the latest/next tags manually since NPM defaults to latest if no tag is provided
child_process.execSync(`export SHIP=true && npm run build && npm publish -f --tag shipping`)
// remove the temporary shipping tag
child_process.execSync(`npm dist-tags remove ${packageName} shipping || true`)

// only if the latest is less than the current version do we tag it (this ignores support branches)
if (semver.gt(packageJson.version, latestVersion)) {
  // add the appropriate next or latest tag manually to the version just published
  child_process.execSync(`npm dist-tags add ${packageName}@${packageJson.version} ${tag}`)
}
