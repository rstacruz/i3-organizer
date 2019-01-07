const pkg = require('../package.json')

const DEFAULTS = {
  workspaceFormat: '{{number}}:{{name}}',
  emptyFormat: '{{number}}:-',

  // If this is found in the name, leave it alone
  lockedSymbol: '+',
  focusedOnly: false,
  renumber: true,
  classAliases: {
    Chrome: 'Web'
    Chromium: 'Web',
    Epiphany: 'Web',
    Firefox: 'Web',
    'Gnome-terminal': 'Term',
    'Gravit-designer': 'Gravit',
    GravitDesigner: 'Gravit',
    krita: 'Krita',
    'Pamac-manager': 'Pamac',
    'System-config-printer.py': 'Print settings',
    Termite: 'Term',
    URxvt: 'Term',
    ViberPC: 'Viber',
    'Virt-manager': 'VM',
    VSCodium: 'Code',
  }
}

const conf = require('rc')(pkg.name, DEFAULTS)

module.exports = conf
