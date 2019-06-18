const pkg = require('../package.json')

const DEFAULTS = {
  workspaceFormat: '{{number}}:{{name}}',
  emptyFormat: '{{number}}:-',

  // If this is found in the name, leave it alone
  lockedSymbol: '+',
  focusedOnly: false,
  renumber: true,
  classAliases: {
    'com.github.parnold-x.nasc': 'Nasc',
    'org.gnome.nautilus': 'Nautilus',
    'cool-retro-term': 'CRT',
    'gnome-terminal': 'Term',
    'gravit-designer': 'Gravit',
    'pamac-manager': 'Pamac',
    'system-config-printer.py': 'Printer',
    'virt-manager': 'VM',
    'figma-linux': 'Figma',
    alacritty: 'Term',
    chrome: 'Web',
    chromium: 'Web',
    epiphany: 'Web',
    firefox: 'Web',
    gravitdesigner: 'Gravit',
    krita: 'Krita',
    termite: 'Term',
    urxvt: 'Term',
    viberpc: 'Viber',
    vlc: 'VLC',
    vscodium: 'Code'
  }
}

const conf = require('rc')(pkg.name, DEFAULTS)

export default conf
