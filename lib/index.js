const Meow = require('meow')
const { execSync } = require('child_process')
const { autoRename } = require('./actions')

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
        simulate: { type: 'boolean', alias: 'D' },
        force: { type: 'boolean', alias: 'f' }
      }
    }
  )
}

function run() {
  const { flags, input } = cli()

  // Get i3 messages
  const messages = organize({
    workspaceFormat: '{{number}}:{{name}}',
    renumber: true
  })

  if (flags.simulate) {
    console.log(messages)
  } else {
    execute(messages)
  }
}

/**
 * Returns i3 messages
 */

function organize(options /*: Options */) /*: string[] */ {
  // Will throw an error if it doesn't work
  const result = execSync('i3-msg -t get_tree')
  const root = JSON.parse(result.toString())

  // Return the messages
  return [...autoRename(options, root)]
}

/**
 * Runs i3 messages
 */

function execute(messages) {
  execSync(`i3-msg ${messages.join(', ')}`)
}

module.exports = { run }
