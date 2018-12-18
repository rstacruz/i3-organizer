const pkg = require('../package.json')

const DEFAULTS = {
  workspaceFormat: '{{number}}:{{name}}',
  emptyFormat: '{{number}}:_',

  // If this is found in the name, leave it alone
  lockedSymbol: '+',
  focusedOnly: false,
  renumber: true,
  classAliases: {
    'Pamac-manager': 'Pamac',
    URxvt: 'Term',
    Termite: 'Term',
    'Gnome-terminal': 'Term',
    VSCodium: 'Code',
    ViberPC: 'Viber',
    GravitDesigner: 'Gravit',
    'Gravit-designer': 'Gravit',
    'System-config-printer.py': 'Print settings',
    krita: 'Krita',
    Firefox: 'Web',
    Chromium: 'Web',
    Epiphany: 'Web',
    Chrome: 'Web'
  }
}

const conf = require('rc')(pkg.name, DEFAULTS)

module.exports = conf
