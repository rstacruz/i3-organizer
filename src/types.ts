export interface ClassAliases {
  [className: string]: string
}

export interface Options {
  renumber?: boolean
  workspaceFormat: string
  emptyFormat: string
  focusedOnly?: boolean
  lockedSymbol?: string | false
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
  focus: number[]
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
