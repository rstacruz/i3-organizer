import throttle from 'lodash.throttle'

interface ServerOpts {
  onWorkspace: () => any
  simulate: boolean
}

function startServer({ onWorkspace, simulate }: ServerOpts) {
  const i3 = require('i3').createClient()

  const ping = () => {
    const messages = onWorkspace()
    if (simulate) {
      console.log(require('util').inspect(messages, { colors: true }))
    } else if (messages.length) {
      i3.command(messages.join(', '))
    }
  }

  const pingThrottled = throttle(ping, 100)

  i3.on('window', ping)
  i3.on('workspace', pingThrottled)
  i3.on('output', pingThrottled)

  ping()
}

export { startServer }
