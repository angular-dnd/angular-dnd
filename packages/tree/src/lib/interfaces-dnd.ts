import {ChildrenSizeMode, Id, ITreeContext, ITreeNode, ITreeSpec} from './interfaces-tree';
import {DropTargetMonitor} from '@angular-dnd/core';

export type TreeItemType = string | symbol;

export interface IDragItem<Data> {
  index: number;
  data: Data;
}

export interface DraggedTreeItemPosition {
  treeId: string;
}

export interface ISize {
  readonly width: number;
  readonly height: number;
}

export interface IDropTargetPosition<Item> {
  readonly parent: Id;
  readonly index: number;
}

export interface IMovedTreeItem<Item> {
  readonly node: ITreeNode<Item>;
  readonly dropTo?: IDropTargetPosition<Item>;
}

export interface IDraggedTreeItem<Item> extends IMovedTreeItem<Item> {
  readonly size?: ISize;
}

export interface IDndTreeSpec<Item> extends ITreeSpec<Item> {
  readonly canDrag?: (node: ITreeNode<Item>) => boolean;
  readonly canDrop?: (node: ITreeNode<Item>, parent: ITreeNode<Item>) => boolean;
  readonly childrenSize?: (node: ITreeNode<Item>) => ChildrenSizeMode;
  readonly maxDepth?: number;
}

export interface IDndTreeContext<Item> extends ITreeContext<Item> {
  spec: IDndTreeSpec<Item>;
}

export interface ITreeState<Item> {
  placePreview(id: Id, to: IDropTargetPosition<Item>): ITreeNode<Item>;

  move(id: Id, to: IDropTargetPosition<Item>, props?: Partial<ITreeNode<Item>>): ITreeNode<Item>

  node(id: Id): ITreeNode<Item>;

  updateNode(id: Id, props: Partial<ITreeNode<Item>>): ITreeNode<Item>;

  updateRoot(rootItem: Item): ITreeNode<Item>;

  expand(id: Id): ITreeNode<Item>;

  collapse(id: Id): ITreeNode<Item>;
}

export interface IDropHovered<Item> {
  readonly node: ITreeNode<Item>;
  readonly rect: () => DOMRect | ClientRect;
}

export interface IDropStrategy<Item> {
  suggestDropPosition(
    monitor: DropTargetMonitor<IDraggedTreeItem<Item>>,
    hovered: IDropHovered<Item>,
  ): IDropTargetPosition<Item>;
}
