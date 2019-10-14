import {
  RootNode,
  AnyNode,
  WorkspaceNode,
  OutputNode,
  Options,
  ClassAliases
} from './types'

import { compact } from './utils'

export interface RenameMsgOptions {
  number: number
  workspaceFormat: string
  emptyFormat: string
  lockedSymbol?: string | false
  classAliases?: ClassAliases
}

import {
  getLabel,
  getClassName,
  getConcernedWindows,
  query,
  isWorkspace,
  isOutput
} from './utils'
import uniq from 'array-uniq'
import keyBy from 'lodash.keyby'
import { Dictionary } from 'lodash'

/** Gets a list of output nodes (ie, displays) */
function getOutputs(root: RootNode): Dictionary<OutputNode> {
  const outputs = query(root, isOutput) as OutputNode[]
  const outputObj = keyBy(outputs, node => node.name)
  return outputObj
}

/** Checks if a given output is the "primary" one */
function isMainOutput(output: OutputNode) {
  return output.rect.x === 0 && output.rect.y === 0
}

/**
 * Autorename workspaces.
 */

function autoRename(options: Options, root: RootNode): string[] {
  const workspaces = query(root, isWorkspace) as WorkspaceNode[]

  // Get the outputs
  const outputs = getOutputs(root)

  let result: any[] = []

  let number = 0
  let rnumber = 0

  workspaces.forEach(workspace => {
    // Find the windows that we're looking for. This can be the focused window
    // (if `focusedOnly` is true), or all the windows in the node.
    const nodes = getConcernedWindows(options, workspace)

    let workspaceNum = workspace.num

    // Figure out what workspace number to use
    if (options.renumber) {
      const isMain = isMainOutput(outputs[workspace.output])
      if (!isMain && options.renumberOnRight) {
        rnumber += 1
        workspaceNum = 10 - rnumber
      } else {
        number += 1
        workspaceNum = number
      }
    }

    const renameOpts: RenameMsgOptions = {
      ...options,
      number: workspaceNum
    }

    // Add the "rename" i3 messages.
    result = [...result, ...renameMsg(options, workspace, nodes, renameOpts)]
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
  options: Options,
  workspace: WorkspaceNode,
  nodes: AnyNode[],
  {
    number,
    workspaceFormat: format,
    emptyFormat,
    lockedSymbol,
    classAliases: aliases
  }: RenameMsgOptions
) {
  // eg, '2:Vim'
  const oldName = workspace.name

  // Find class names, map them to the alias map if need be
  let nodeNames: string[] = compact(
    nodes.map((node: AnyNode) => node && getClassName(node))
  )

  let focusedNames = nodeNames.map(
    (className: string) =>
      (aliases && aliases[className.toLowerCase()]) || className
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

export { autoRename }
