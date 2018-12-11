// @flow

export type ClassAliases = {
  [string]: string
}

export type Options = {
  renumber?: boolean,
  workspaceFormat: string,
  emptyFormat: string,
  focusedOnly?: boolean,
  lockedSymbol?: string | false,
  classAliases?: ClassAliases
}

export type WindowProperties = {
  class: string, // 'URxvt'
  instance: string, // 'urxvt'
  title: string
}
export type NodeBase = {
  id: string,
  nodes: AnyNode[],
  floating_nodes?: AnyNode[],
  focused?: boolean,
  window?: number,
  window_properties?: WindowProperties,
  name: string // 'root'
}

export type RootNode = NodeBase & {
  type: 'root'
}

export type OutputNode = NodeBase & {
  type: 'output'
}

// A window!
export type ContainerNode = NodeBase & {
  type: 'con',
  orientation: string, // 'horizontal'
  output: string, // '__i3'
  window: number // window ID
}

export type WorkspaceNode = NodeBase & {
  type: 'workspace',
  num: number,
  output: string, // 'HDMI1'
  name: string, // '1:Vim'
  gaps?: { inner: number, outer: number },
  focus: number[]
}

export type AnyNode = RootNode | OutputNode | ContainerNode | WorkspaceNode

/*
 * root:
 *   - output:
 *     - container:
 *       - workspace:
 */
