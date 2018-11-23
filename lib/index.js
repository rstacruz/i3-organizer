const Meow = require('meow')
const { execSync } = require('child_process')
const { autoRename, renumberWorkspaces } = require('./actions')

function cli() {
  return Meow(
    `
    Usage: 
      $ ${process.argv[1]} [options]

    Options:
      -h, --help        show usage information
      -v, --version     print version info and exit
  `,
    {
      flags: {
        help: { type: 'boolean', alias: 'h' },
        version: { type: 'boolean', alias: 'v' },
        force: { type: 'boolean', alias: 'f' }
      }
    }
  )
}

function run() {
  const { flags, input } = cli()
  const commands = organize()
  console.log(commands)
}

function organize() {
  // Will throw an error if it doesn't work
  const result = execSync('i3-msg -t get_tree')
  const root = JSON.parse(result.toString())

  // Return the commands
  return [...autoRename(root), ...renumberWorkspaces(root)]
}

module.exports = { run }
