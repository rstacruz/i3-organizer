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
  const options /*: Options */ = {
    workspaceFormat: '{{index}}:{{name}}'
  }
  const commands = organize(options)
  console.log(commands)
}

function organize(options /*: Options */) {
  // Will throw an error if it doesn't work
  const result = execSync('i3-msg -t get_tree')
  const root = JSON.parse(result.toString())

  // Return the commands
  return [...autoRename(options, root), ...renumberWorkspaces(options, root)]
}

module.exports = { run }
