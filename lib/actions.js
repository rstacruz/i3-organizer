const { getClassName, query, find } = require('./utils')

/**
 * Autorename workspaces.
 */

function autoRename(
  options /*: Options */,
  root /*: RootNode */
) /*: string[] */ {
  const workspaces = query(root, node => node.type === 'workspace')
  console.log(workspaces)
  let result = []

  workspaces.forEach(workspace => {
    workspace.focus.forEach(id => {
      const node /*: ?ContainerWindow */ = find(
        root,
        node => node.id === id && node.window
      )
      if (node) {
        result = [...result, ...renameCmd(workspace, node)]
      }
    })
  })

  return result

  // // Manipulate the focused window
  // const focused = getFocusedWindow(root)
  // if (focused) {
  //   const name = getClassName(focused) || focused.name
  //   const message = `rename workspace to ${JSON.stringify(name)}`
  //   return [`i3-msg ${JSON.stringify(message)}`]
  // }
}

function renameCmd(workspace, node) {
  const name = '' + workspace.num + ':' + getClassName(node) || node.name
  const oldName = workspace.name
  const message = `rename workspace ${JSON.stringify(
    oldName
  )} to ${JSON.stringify(name)}`
  return [`i3-msg ${JSON.stringify(message)}`]
}

/**
 * Renumber workspaces
 */

function renumberWorkspaces(options /*: Options */, root /*: RootNode */) {
  return []
}

module.exports = { autoRename, renumberWorkspaces }
