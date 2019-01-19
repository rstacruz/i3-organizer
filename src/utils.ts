import { AnyNode, ContainerNode, Options, WorkspaceNode } from './types'

function getClassName(con: AnyNode): string | undefined {
  return con.window_properties && con.window_properties.class
}

/**
 * Collect nodes that match a given matcher
 */

function query(
  root: AnyNode,
  matcherFn: (node: AnyNode) => any,
  result: AnyNode[] = []
): AnyNode[] {
  if (matcherFn(root)) {
    result = [...result, root]
  }

  if (root.nodes) {
    result = [...root.nodes, ...(root.floating_nodes || [])].reduce(
      (result, node) => query(node, matcherFn, result),
      result
    )
  }

  return result
}

function find(
  root: AnyNode,
  matcherFn: (node: AnyNode) => any
): AnyNode | void {
  if (matcherFn(root)) {
    return root
  }

  if (root.nodes) {
    return [...root.nodes, ...(root.floating_nodes || [])].reduce(
      (result: any, node: any) => result || find(node, matcherFn),
      null
    )
  }
}

/**
 * Returns windows that the given workspace is concerned about.
 */

function getConcernedWindows(
  options: Options,
  workspace: WorkspaceNode
): AnyNode[] {
  if (options.focusedOnly) {
    return [getFocusedWindow(workspace)].filter(Boolean)
  } else {
    return query(
      workspace,
      node => node.window_properties && node.window_properties.class
    )
  }
}

/**
 * Returns the focused window in a workspace.
 */

function getFocusedWindow(workspace: WorkspaceNode) {
  if (workspace.type !== 'workspace') return

  // For non-visible workspaces, there's a running list of focused
  // windows under `focus`. If that exists, use it.
  if (workspace.focus) {
    const node: AnyNode | null = workspace.focus.reduce(
      (result: AnyNode | null, id: string) => {
        if (result) return result
        return find(workspace, (node: AnyNode) => node.id === id && node.window)
      },
      null
    )

    if (node) return node
  }

  // Otherwise (usually for active workspaces), find the focused
  // window in it (the one with the `focused` flag) and use that.
  {
    const node = find(workspace, node => node.focused)
    if (node) return node
  }

  {
    // Otherwise, find any other window
    const node = find(workspace, node => node.type === 'con')
    if (node) return node
  }
}

/**
 * Returns the label for a workspace name.
 *
 * @example
 *     getLabel('3:Vim') // => 'Vim'
 */

function getLabel(name: string) {
  if (name.includes(':')) {
    const [_n, label] = name.split(':')
    return label
  } else {
    return name
  }
}

/*
 * Export
 */

export { find, getClassName, getConcernedWindows, getLabel, query }
