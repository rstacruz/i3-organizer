const { getFocusedWindow, getFocusedNodes, getClassName } = require('./utils')

/**
 * Autorename workspaces.
 */

function autoRename(
  options /*: Options */,
  root /*: RootNode */
) /*: string[] */ {
  // Manipulate the focused window
  const focused = getFocusedWindow(root)
  if (focused) {
    const name = getClassName(focused) || focused.name
    const message = `rename workspace to ${JSON.stringify(name)}`
    return [`i3-msg ${JSON.stringify(message)}`]
  }

  return []
}

/**
 * Renumber workspaces
 */

function renumberWorkspaces(options /*: Options */, root /*: RootNode */) {
  return []
}

module.exports = { autoRename, renumberWorkspaces }
