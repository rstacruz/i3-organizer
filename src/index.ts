import Meow from 'meow'
import { execSync } from 'child_process'
import { autoRename } from './actions'
import Conf from './config'
import { startServer } from './server'
import { checkI3 } from './check_i3'
import { Options } from './types'
import i3 from 'i3'

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

async function run() {
  const { flags, input } = cli()

  const config = {
    workspaceFormat: Conf.workspaceFormat,
    emptyFormat: Conf.emptyFormat,
    focusedOnly: Conf.focusedOnly,
    lockedSymbol: Conf.lockedSymbol,
    renumber: Conf.renumber,
    renumberOnRight: Conf.renumberOnRight,
    classAliases: Conf.classAliases
  }

  try {
    const info = await checkI3()
    console.log('Using i3 version', info.human_readable)
  } catch (error) {
    console.error(error.message)
    process.exit(1)
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

function organize(options: Options): string[] {
  // Will throw an error if it doesn't work
  const result = execSync('i3-msg -t get_tree')
  const root = JSON.parse(result.toString())

  // Return the messages
  return [...autoRename(options, root)]
}

module.exports = { run }
