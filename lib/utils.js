function getClassName(con /*: ContainerNode */) /*: ?string */ {
  return con.window_properties && con.window_properties.class
}

function getFocusedWindow(root /*: RootNode */) /*: ?Node */ {
  const nodes = getFocusedNodes(root).filter(node => node.type === 'con')
  return nodes && nodes[0]
}

function getFocusedNodes(root /*: Node */, result = []) /*: Node[] */ {
  if (root.focused) {
    result = [...result, root]
  }

  if (root.nodes) {
    result = root.nodes.reduce(
      (result, node) => getFocusedNodes(node, result),
      result
    )
  }

  return result
}

module.exports = {
  getFocusedWindow,
  getFocusedNodes,
  getClassName
}
