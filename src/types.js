// @flow

import type Path from "./Path"

export type PathNode = string | number
export type TreeNode = Proxy<NodeHandler>
export type Children = { [string]: TreeNode }
export type CacheKeyResolver = (...any) => string

export type StoreApplyAction = { $apply: any => any }
export type StoreSetAction = { $set: any }
export type StoreMergeAction = { $merge: any }
export type StoreDeleteAction = { $splice: [[number, 1]] }
export type StoreActions =
  StoreApplyAction |
  StoreSetAction   |
  StoreMergeAction |
  StoreDeleteAction
