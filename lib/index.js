const Meow = require('meow')
const { execSync } = require('child_process')
const { autoRename } = require('./actions')
const i3 = require('i3')

function cli() {
  return Meow(
    `
    Usage: 
      $ ${process.argv[1]} [options]

    Options:
      -f, --foreground
      -n, --simulate

    Options:
      -h, --help        show usage information
      -v, --version     print version info and exit
  `,
    {
      flags: {
        help: { type: 'boolean', alias: 'h' },
        version: { type: 'boolean', alias: 'v' },
        simulate: { type: 'boolean', alias: 'n' },
        foreground: { type: 'boolean', alias: 'f' }
      }
    }
  )
}

function run() {
  const { flags, input } = cli()

  // Get i3 messages
  const onWorkspace = () => {
    return organize({
      workspaceFormat: '{{number}}:{{name}}',
      emptyFormat: '{{number}}:_',
      renumber: true
    })
  }

  if (flags.foreground) {
    console.log('running in foreground, ^C to abort')
    startServer({ onWorkspace })
  }

  if (flags.simulate) {
    const messages = onWorkspace()
    console.log(messages)
  } else {
    const messages = onWorkspace()
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

function startServer({ onWorkspace }) {
  const i3 = require('i3').createClient()
  i3.command(onWorkspace().join(', '))

  i3.on('workspace', () => {
    i3.command(onWorkspace().join(', '))
  })
}

module.exports = { run }
