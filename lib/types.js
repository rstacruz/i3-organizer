// @flow

export interface INode {
  type: 'root' | 'output' | 'con' | 'workspace';
  id: string;
  name: string;
  nodes: AnyNode[];
  focused: true;
}

export type NodeBase = {
  id: string,
  nodes: AnyNode[],
  floating_nodes: AnyNode[],
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
  window: number, // window ID
  window_properties: {
    class: string, // 'URxvt'
    instance: string, // 'urxvt'
    title: string
  }
}

export type WorkspaceNode = NodeBase & {
  type: 'workspace',
  num: number,
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
