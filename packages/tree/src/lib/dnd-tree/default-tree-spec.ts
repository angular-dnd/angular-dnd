import {Id, ITreeNode, ITreeSpec} from './interfaces-tree';
import {IDndTreeSpec} from './interfaces-dnd';

interface ITreeItem<Item = any> {
  id: Id;
}

export function defaultTreeSpec<Item extends ITreeItem>(getChildItems: (item: Item) => Item[]): ITreeSpec<Item> {
  return {
    itemId: item => item.id,
    hasChildren: item => !!(getChildItems(item))?.length,
    childrenCount: item => getChildItems(item)?.length,
    getChildItems,
  };
}

export function defaultDndTreeSpec<Item extends ITreeItem>(getChildItems: (item: Item) => Item[]): IDndTreeSpec<Item> {
  return {
    ...defaultTreeSpec<Item>(getChildItems),
    canDrag: (node: ITreeNode<Item>) => !!node.parent, // By default root node is not draggable
  };
}
