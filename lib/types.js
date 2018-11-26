// @flow

interface INode {
  type: 'root' | 'output' | 'con' | 'workspace';
  id: string;
  name: string;
  nodes: Node[];
  focused: true;
}

type RootNode = {
  type: 'root',
  id: string,
  name: string, // 'root'
  nodes: Node[] // OutputNode?
}

type OutputNode = {
  type: 'output',
  name: string, // '__i3'
  nodes: Node[] // ContainerNode?
}

// A window!
type ContainerNode = {
  type: 'con',
  orientation: string, // 'horizontal'
  output: string, // '__i3'
  window: number, // window ID
  window_properties: {
    class: string, // 'URxvt'
    instance: string, // 'urxvt'
    title: string
  },
  nodes: Node[] // WorkspaceNode?
}

type WorkspaceNode = {
  type: 'workspace',
  name: string, // '5:Vim'
  num: number,
  gaps?: { inner: number, outer: number },
  focus: number[],
  nodes: Node[]
}

type Node = RootNode | OutputNode | ContainerNode | WorkspaceNode

/*
 * root:
 *   - output:
 *     - container:
 *       - workspace:
 */
