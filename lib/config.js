const pkg = require('../package.json')

const DEFAULTS = {
  workspaceFormat: '{{number}}:{{name}}',
  emptyFormat: '{{number}}:_',
  focusedOnly: false,
  renumber: true,
  classAliases: {
    'Pamac-updater': 'Pamac',
    URxvt: 'Term',
    Termite: 'Term',
    'Gnome-terminal': 'Term',
    VSCodium: 'Code',
    ViberPC: 'Viber',
    GravitDesigner: 'Gravit',
    'Gravit-designer': 'Gravit',
    'System-config-printer.py': 'Print settings',
    Firefox: 'Web',
    Chromium: 'Web',
    Epiphany: 'Web',
    Chrome: 'Web'
  }
}

const conf = require('rc')(pkg.name, DEFAULTS)

module.exports = conf
