const pkg = require('../package.json')

const DEFAULTS = {
  workspaceFormat: '{{number}}:{{name}}',
  emptyFormat: '{{number}}:_',
  focusedOnly: false,
  renumber: true,
  classAliases: {
    'Pamac-updater': 'Pamac',
    URxvt: 'Urxvt',
    VSCodium: 'Code',
    GravitDesigner: 'Gravit'
  }
}

const conf = require('rc')(pkg.name, DEFAULTS)

module.exports = conf
