import { Options } from './types'

// @ts-ignore
const pkg = require('../package.json')

const DEFAULTS: Options = {
  // Format for a workspace with names
  workspaceFormat: '{{number}}:{{name}}',

  // Format for a workspace without windows. Only when autoRename is on
  emptyFormat: '{{number}}:-',

  // If this is found in the name, don't auto-rename
  lockedSymbol: '+',
  focusedOnly: false,

  // Renumber workspaces to be sequential (1, 2, 3, 4)
  renumber: true,

  // Rename workspaces based on the windows that are open
  autoRename: false,

  // On dual displays, move the non-primary workspaces to 7, 8, 9
  renumberOnRight: true,

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
