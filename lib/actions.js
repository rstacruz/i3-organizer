const { getFocusedWindow, getFocusedNodes, getClassName } = require('./utils')

function autoRename(root /*: RootNode */) /*: string[] */ {
  // Manipulate the focused window
  const focused = getFocusedWindow(root)
  if (focused) {
    const name = getClassName(focused) || focused.name
    const message = `rename workspace to ${JSON.stringify(name)}`
    return [`i3-msg ${JSON.stringify(message)}`]
  }

  return []
}

function renumberWorkspaces(root /*: RootNode */) {
  return []
}

module.exports = { autoRename, renumberWorkspaces }
