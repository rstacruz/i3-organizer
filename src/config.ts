const pkg = require('../package.json')

const DEFAULTS = {
  workspaceFormat: '{{number}}:{{name}}',
  emptyFormat: '{{number}}:-',

  // If this is found in the name, leave it alone
  lockedSymbol: '+',
  focusedOnly: false,
  renumber: true,
  classAliases: {
    'cool-retro-term': 'CRT',
    'Gnome-terminal': 'Term',
    'Gravit-designer': 'Gravit',
    'Pamac-manager': 'Pamac',
    'System-config-printer.py': 'Printer',
    'Virt-manager': 'VM',
    Chrome: 'Web',
    Chromium: 'Web',
    Epiphany: 'Web',
    Firefox: 'Web',
    GravitDesigner: 'Gravit',
    krita: 'Krita',
    Termite: 'Term',
    URxvt: 'Term',
    ViberPC: 'Viber',
    VSCodium: 'Code'
  }
}

const conf = require('rc')(pkg.name, DEFAULTS)

module.exports = conf
