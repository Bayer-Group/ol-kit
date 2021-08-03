const child_process = require('child_process')

if (process.env.SHIP !== 'true') {
  child_process.execSync(`
    printf "\\033[0;31m
      ==========================================================\n
      'npm publish' is not allowed -- use 'npm run ship' instead\n
      ==========================================================\n\n\n" && exit 1;`
  )
} else {
  child_process.execSync(`
    printf "\\033[0;32m
      ===============================\n
      thanks for using 'npm run ship'\n
      ===============================\n\n\n" && exit 0;`
  )
}
