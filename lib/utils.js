// @flow

/*::
  import type {
    ContainerNode,
    AnyNode
  } from './types'
*/

function getClassName(con /*: AnyNode */) /*: ?string */ {
  return con.window_properties && con.window_properties.class
}

/**
 * Collect nodes that match a given matcher
 */

function query(
  root /*: AnyNode */,
  matcherFn /*: (AnyNode) => any */,
  result /*: AnyNode[] */ = []
) /*: AnyNode[] */ {
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
  root /*: AnyNode */,
  matcherFn /*: (AnyNode) => any */
) /*: ?AnyNode */ {
  if (matcherFn(root)) {
    return root
  }

  if (root.nodes) {
    return [...root.nodes, ...(root.floating_nodes || [])].reduce(
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
