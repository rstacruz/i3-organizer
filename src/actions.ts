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

  const mainWorkspaces = workspaces.filter(workspace => {
    return !!isMainOutput(outputs[workspace.output])
  })

  // How many non-main workspaces are there
  const otherWorkspacesCount = workspaces.length - mainWorkspaces.length

  workspaces.forEach(workspace => {
    // Find the windows that we're looking for. This can be the focused window
    // (if `focusedOnly` is true), or all the windows in the node.
    const nodes = getConcernedWindows(options, workspace)

    let workspaceNum = workspace.num

    // Figure out what workspace number to use
    if (options.renumber) {
      const isMain = mainWorkspaces.includes(workspace)
      if (!isMain && options.renumberOnRight) {
        rnumber += 1
        workspaceNum = 9 - otherWorkspacesCount + rnumber
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
  // eg, ['urxvt', 'chrome']
  let nodeNames: string[] = compact(
    nodes.map((node: AnyNode) => node && getClassName(node))
  )

  // eg, ['Term', 'Web']
  let focusedNames = nodeNames.map(
    (className: string) =>
      (aliases && aliases[className.toLowerCase()]) || className
  )

  let focusedName = uniq(focusedNames.sort()).join(' · ')
  let newName

  // Check if the workspace is locked
  const isLocked = isWorkspaceLocked(workspace, options)

  // Build the new name (eg, '3:Vim')
  if (isLocked) {
    const label = getLabel(workspace.name)
    if (label) {
      newName = format
        .replace('{{number}}', `${number}`)
        .replace('{{name}}', label)
    } else {
      newName = `${number}`
    }
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
  const msg = `rename workspace ${s(oldName)} to ${s(newName)}`
  // console.log(msg)
  return [msg]
}

/**
 * Checks if a given workspace is meant to be renamed or not.
 */

function isWorkspaceLocked(
  workspace: WorkspaceNode,
  options: Options
): Boolean {
  const { lockedSymbol, autoRename } = options

  if (!autoRename) return true

  if (typeof lockedSymbol === 'string') {
    return workspace.name.includes(lockedSymbol)
  }

  return false
}

/*
 * Export
 */

export { autoRename }
