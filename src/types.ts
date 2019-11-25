export interface ClassAliases {
  [className: string]: string
}

export interface Options {
  /** Renumber workspaces to be sequential (1, 2, 3, 4) */
  renumber?: boolean

  /** Rename workspaces based on the windows that are open */
  autoRename: boolean

  /** On dual displays, move the non-primary workspaces to 7, 8, 9 */
  renumberOnRight?: boolean

  /** If this is found in the name, don't auto-rename */
  lockedSymbol?: string | false

  /** Format for a workspace with names */
  workspaceFormat: string

  /** Format for a workspace without windows. Only when autoRename is on */
  emptyFormat: string
  focusedOnly?: boolean
  output?: string
  classAliases?: ClassAliases
}

export interface WindowProperties {
  class: string // 'URxvt'
  instance: string // 'urxvt'
  title: string
}

export interface NodeBase {
  id: string
  nodes: AnyNode[]
  floating_nodes?: AnyNode[]
  focused?: boolean
  window?: number
  window_properties?: WindowProperties
  name: string // 'root'
  type: string
}

export interface RootNode extends NodeBase {
  type: 'root'
}

export interface OutputNode extends NodeBase {
  type: 'output'
  rect: {
    x: number
    y: number
    width: number
    height: number
  }
}

// A window!
export interface ContainerNode extends NodeBase {
  type: 'con'
  orientation: string // 'horizontal'
  output: string // '__i3'
  window: number // window ID
}

export interface WorkspaceNode extends NodeBase {
  type: 'workspace'
  num: number
  output: string // 'HDMI1'
  name: string // '1:Vim'
  gaps?: { inner: number; outer: number }
  focus: string[]
}

export type AnyNode = NodeBase

export interface I3Version {
  major: number // 4
  minor: number // 16
  patch: number // 0
  human_readable: string // '4.16 (2018-11-04)'
  loaded_config_file_name: string
}

/*
 * root:
 *   - output:
 *     - container:
 *       - workspace:
 */
