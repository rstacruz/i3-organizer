const { getClassName, query, find } = require('./utils')

/**
 * Autorename workspaces.
 */

function autoRename(
  options /*: Options */,
  root /*: RootNode */
) /*: string[] */ {
  const workspaces = query(root, node => node.type === 'workspace')
  let result = []
  let number = 0

  workspaces.forEach((workspace /*: WorkspaceNode */) => {
    number += 1
    const node = getFocusedWindow(workspace)
    result = [
      ...result,
      ...renameMsg(workspace, node, {
        number: options.renumber ? number : workspace.num,
        format: options.workspaceFormat,
        emptyFormat: options.emptyFormat
      })
    ]
  })

  return result.reverse()
}

/**
 * Returns the focused window
 */

function getFocusedWindow(workspace) {
  // For non-visible workspaces, there's a running list of focused
  // windows under `focus`. If that exists, use it.
  const id = workspace.focus && workspace.focus[0]
  if (id) {
    const node /*: ?ContainerWindow */ = find(
      workspace,
      node => node.id === id && node.window
    )

    if (node) return node
  }

  // Otherwise (usually for active workspaces), find the focused
  // window in it (the one with the `focused` flag) and use that.
  const node = find(workspace, node => node.focused)
  if (node) return node
}

/**
 * Builds a rename message for i3
 *
 *    renameMsg(n, m, { ... })
 *    => 'rename workspace "lol" to "4:Urxvt"
 */

function renameMsg(
  workspace,
  node /*: ?Node */,
  { number, format, emptyFormat }
) {
  const s = JSON.stringify.bind(JSON)
  const oldName = workspace.name
  let newName

  // Build the new name (eg, '3:Vim')
  if (node) {
    newName = format
      .replace('{{number}}', number)
      .replace('{{name}}', getClassName(node) || node.name)
  } else {
    newName = emptyFormat.replace('{{number}}', number)
  }

  // Noop if there's nothing to do
  if (newName === oldName) return []

  return [`rename workspace ${s(oldName)} to ${s(newName)}`]
}

module.exports = { autoRename }