// @flow

/*::
  import type {
    RootNode,
    AnyNode,
    WorkspaceNode,
    ContainerNode,
    Options,
    ClassAliases
  } from './types'

*/

const { getClassName, query, find } = require('./utils')
const uniq = require('array-uniq')

/**
 * Autorename workspaces.
 */

function autoRename(
  options /*: Options */,
  root /*: RootNode */
) /*: string[] */ {
  const workspaces = query(
    root,
    (node /*: AnyNode */) => node.type === 'workspace' && node.output !== '__i3'
  )
  let result = []
  let number = 0

  workspaces.forEach((subnode /*: AnyNode */) => {
    if (subnode.type !== 'workspace') return
    const workspace /*: WorkspaceNode */ = subnode

    number += 1
    let nodes
    if (options.focusedOnly) {
      nodes = [getFocusedWindow(workspace)].filter(Boolean)
    } else {
      nodes = query(
        workspace,
        node => node.window_properties && node.window_properties.class
      )
    }
    result = [
      ...result,
      ...renameMsg(workspace, nodes, {
        number: options.renumber ? number : workspace.num,
        format: options.workspaceFormat,
        emptyFormat: options.emptyFormat,
        aliases: options.classAliases
      })
    ]
  })

  return result
}

/**
 * Returns the focused window
 */

function getFocusedWindow(workspace /*: WorkspaceNode */) {
  if (workspace.type !== 'workspace') return

  // For non-visible workspaces, there's a running list of focused
  // windows under `focus`. If that exists, use it.
  if (workspace.focus) {
    const node /*: ?AnyNode */ = workspace.focus.reduce(
      (result, id) =>
        result ||
        find(workspace, (node /*: AnyNode */) => node.id === id && node.window),
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
 * Builds a rename message for i3
 *
 *    renameMsg(n, m, { ... })
 *    => 'rename workspace "lol" to "4:Urxvt"
 */

function renameMsg(
  workspace,
  nodes /*: AnyNode[] */,
  {
    number,
    format,
    emptyFormat,
    aliases
  } /*: { number: number, format: string, emptyFormat: string, aliases: ?ClassAliases } */
) {
  const oldName = workspace.name

  // Find class names, map them to the alias map if need be
  let focusedNames = nodes
    .map(node => node && getClassName(node))
    .filter(Boolean)
    .map(
      (className /*: string */) => (aliases && aliases[className]) || className
    )

  let focusedName = uniq(focusedNames.sort()).join(', ')
  let newName

  // Build the new name (eg, '3:Vim')
  if (focusedName) {
    newName = format
      .replace('{{number}}', `${number}`)
      .replace('{{name}}', focusedName)
  } else {
    newName = emptyFormat.replace('{{number}}', `${number}`)
  }

  // Noop if there's nothing to do
  if (newName === oldName) return []

  const s = JSON.stringify.bind(JSON)
  return [`rename workspace ${s(oldName)} to ${s(newName)}`]
}

module.exports = { autoRename }
