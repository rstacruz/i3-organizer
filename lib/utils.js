function getClassName(con /*: ContainerNode */) /*: ?string */ {
  return con.window_properties && con.window_properties.class
}

/**
 * Collect nodes that match a given matcher
 */

function query(
  root /*: Node */,
  matcherFn /*: (Node) => ?boolean */,
  result = []
) {
  if (matcherFn(root)) {
    result = [...result, root]
  }

  if (root.nodes) {
    result = [...root.nodes, ...root.floating_nodes].reduce(
      (result, node) => query(node, matcherFn, result),
      result
    )
  }

  return result
}

function find(
  root /*: Node */,
  matcherFn /*: (Node) => ?boolean */
) /*: ?Node */ {
  if (matcherFn(root)) {
    return root
  }

  if (root.nodes) {
    return [...root.nodes, ...root.floating_nodes].reduce(
      (result, node) => result || find(node, matcherFn),
      null
    )
  }
}

/*
 * Export
 */

module.exports = {
  getClassName,
  query,
  find
}
