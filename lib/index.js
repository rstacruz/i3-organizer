// @flow

/*::
  import type { Options } from './types'
*/

const Meow = require('meow')
const { execSync } = require('child_process')
const { autoRename } = require('./actions')
const throttle = require('lodash.throttle')
const i3 = require('i3')

function cli() {
  return Meow(
    `
    Usage: 
      $ ${process.argv[1]} [options]

    Mode:
          --once        run once
      -f, --foreground  run in the foreground (default)
      -D, --daemon      run in the background
      -n, --simulate    run as simulation

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
        once: { type: 'boolean' },
        foreground: { type: 'boolean', alias: 'f', default: true }
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
      focusedOnly: false,
      renumber: true
    })
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
    startServer({ onWorkspace })
    return
  }

  if (flags.simulate) {
    const messages = onWorkspace()
    console.log(messages)
  } else if (flags.once) {
    const messages = onWorkspace()
    execute(messages)
  } else {
    console.log('dunno what to do')
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

function execute(messages /*: string[] */) /*: void */ {
  execSync(`i3-msg ${messages.join(', ')}`)
}

function startServer({ onWorkspace }) {
  const i3 = require('i3').createClient()

  const ping = () => {
    const messages = onWorkspace()
    if (messages.length) {
      console.log(messages)
      i3.command(messages.join(', '))
    }
  }

  const pingThrottled = throttle(ping, 100)

  i3.on('window', ping)
  i3.on('workspace', pingThrottled)
  i3.on('output', pingThrottled)

  ping()
}

module.exports = { run }
