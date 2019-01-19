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

  export type RenameMsgOptions = {
    number: number,
    workspaceFormat: string,
    emptyFormat: string,
    lockedSymbol: string | boolean,
    classAliases: ?ClassAliases
  }
*/

const {
  getLabel,
  getClassName,
  getConcernedWindows,
  query,
  find
} = require('./utils')
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

    // Coerce to a workspace.
    const workspace /*: WorkspaceNode */ = subnode

    number += 1

    // Find the windows that we're looking for. This can be the focused window
    // (if `focusedOnly` is true), or all the windows in the node.
    const nodes = getConcernedWindows(options, workspace)

    // Add the "rename" i3 messages.
    result = [
      ...result,
      ...renameMsg(options, workspace, nodes, {
        ...options,
        number: options.renumber ? number : workspace.num
      })
    ]
  })

  return result
}

/**
 * Builds a rename message for i3
 *
 *    renameMsg(options, n, m, { ... })
 *    => 'rename workspace "lol" to "4:Urxvt"
 */

function renameMsg(
  options /*: Options */,
  workspace /*: WorkspaceNode */,
  nodes /*: AnyNode[] */,
  {
    number,
    workspaceFormat: format,
    emptyFormat,
    lockedSymbol,
    classAliases: aliases
  } /*: RenameMsgOptions */
) {
  // eg, '2:Vim'
  const oldName = workspace.name

  // Find class names, map them to the alias map if need be
  let focusedNames = nodes
    .map(node => node && getClassName(node))
    .filter(Boolean)
    .map(
      (className /*: string */) => (aliases && aliases[className]) || className
    )

  let focusedName = uniq(focusedNames.sort()).join(' · ')
  let newName

  // Check if the workspace is locked
  const isLocked =
    typeof lockedSymbol === 'string'
      ? workspace.name.includes(lockedSymbol)
      : false

  // Build the new name (eg, '3:Vim')
  if (isLocked) {
    newName = format
      .replace('{{number}}', `${number}`)
      .replace('{{name}}', getLabel(workspace.name))
  } else if (focusedName) {
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

/*
 * Export
 */

module.exports = { autoRename }