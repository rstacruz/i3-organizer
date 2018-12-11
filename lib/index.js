// @flow

/*::
  import type { Options } from './types'
*/

const Meow = require('meow')
const { execSync } = require('child_process')
const { autoRename } = require('./actions')
const Conf = require('./config')
const { startServer } = require('./server')
const i3 = require('i3')

function cli() {
  return Meow(
    `
    Usage: 
      $ ${process.argv[1]} [options]

    Mode:
      -f, --foreground  run in the foreground (default)
      -D, --daemon      run in the background
      -n, --simulate    run as simulation

          --config

    Options:
      -h, --help        show usage information
      -v, --version     print version info and exit
  `,
    {
      flags: {
        help: { type: 'boolean', alias: 'h' },
        version: { type: 'boolean', alias: 'v' },
        simulate: { type: 'boolean', alias: 'n' },
        daemon: { type: 'boolean', alias: 'D' },
        config: { type: 'boolean' },
        foreground: { type: 'boolean', alias: 'f', default: true }
      }
    }
  )
}

function run() {
  const { flags, input } = cli()

  const config = {
    workspaceFormat: Conf.workspaceFormat,
    emptyFormat: Conf.emptyFormat,
    focusedOnly: Conf.focusedOnly,
    lockedSymbol: Conf.lockedSymbol,
    renumber: Conf.renumber,
    classAliases: Conf.classAliases
  }

  // Get i3 messages
  const onWorkspace = () => {
    return organize(config)
  }

  if (flags.daemon) {
    const pidfile = `${process.env.HOME || '~'}/.cache/i3-organizer.pid`

    require('daemonize-process')()
    require('npid')
      .create(pidfile)
      .removeOnExit()
  }
  if (flags.foreground || flags.daemon) {
    if (!flags.daemon) {
      console.log('running in foreground, ^C to abort')
    }

    if (flags.simulate) {
      console.log('(simulation mode is on)')
    }

    return startServer({ onWorkspace, simulate: flags.simulate })
  }

  console.log('dunno what to do')
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

function execute(messages /*: string[] */) /*: void */ {
  execSync(`i3-msg ${messages.join(', ')}`)
}

module.exports = { run }
