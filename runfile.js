const { run } = require('runjs')
const semver = require('semver')
const child_process = require('child_process')
const packageJson = require('./package.json')

const packageName = packageJson.name

function ship () {
  const tag = packageJson.version.includes('-') ? 'next' : 'legacy'
  const legacyVersion = child_process.execSync(`npm view ${packageName}@legacy version`).toString()

  // publish with a `shipping` tag so we can control the legacy/next tags manually since NPM defaults to legacy if no tag is provided
  run(`export SHIP=true && npm run build && npm publish -f --tag shipping`)
  // remove the temporary shipping tag
  run(`npm dist-tags remove ${packageName} shipping || true`)

  // only if the legacy is less than the current version do we tag it (this ignores support branches)
  if (semver.gt(packageJson.version, legacyVersion)) {
    // add the appropriate next or legacy tag manually to the version just published
    run(`npm dist-tags add ${packageName}@${packageJson.version} ${tag}`)
  }
}

function preventPublish () {
  if (process.env.SHIP !== 'true') {
    run(`
      printf "\\033[0;31m
        ==========================================================\n
        'npm publish' is not allowed -- use 'npm run ship' instead\n
        ==========================================================\n\n\n" && exit 1;`
    )
  } else {
    run(`
      printf "\\033[0;32m
        ===============================\n
        thanks for using 'npm run ship'\n
        ===============================\n\n\n" && exit 0;`
    )
  }
}

module.exports = {
  preventPublish,
  ship
}
