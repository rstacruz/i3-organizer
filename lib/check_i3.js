// @flow
const spawn = require('child_process').spawn

/*::
  import type { I3Version } from './types'
*/

/**
 * Checks if I3 is available.
 */

function checkI3() /*: Promise<I3Version> */ {
  return new Promise((resolve, reject) => {
    const proc = spawn('i3-msg', ['-t', 'get_version'])
    let result = ''

    proc.stdout.on('data', data => {
      result += data.toString()
    })

    proc.on('close', code => {
      if (code !== 0) {
        // It's available
        const err = Object.assign(new Error('I3 not available'), {})
        reject(err)
      } else {
        // It's okay
        resolve(JSON.parse(result))
      }
    })
  })
}

module.exports = { checkI3 }
