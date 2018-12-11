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

const {
  isLocked,
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

    // Don't process workspaces that are specially marked to never rename.
    if (isLocked(options, workspace)) return

    // Find the windows that we're looking for. This can be the focused window
    // (if `focusedOnly` is true), or all the windows in the node.
    // TODO: allow it to be renumbered, but not renamed
    const nodes = getConcernedWindows(options, workspace)

    // Add the "rename" i3 messages.
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

  let focusedName = uniq(focusedNames.sort()).join(' · ')
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
