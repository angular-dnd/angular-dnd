import {Id, ITreeNode} from './interfaces-tree';
import {IDndTreeContext, IDndTreeSpec, IDropTargetPosition, ITreeState} from './interfaces-dnd';
import {Subject} from 'rxjs';

interface INodeState<Item> {
  node: ITreeNode<Item>;
  changed: Subject<ITreeNode<Item>>;
}

export class TreeState<Item> implements ITreeState<Item> {

  private rootNode: ITreeNode<Item>;
  private spec: IDndTreeSpec<Item>;
  private tree: IDndTreeContext<Item>;

  private nodes: { [id: string]: INodeState<Item> } = {};

  private dragging: {
    [id: string]: IDropTargetPosition<Item>
  } = {};

  private markAsChanged(node: ITreeNode<Item>, changedNodes: Id[]): ITreeNode<Item> {
    const {id} = node;
    this.nodes[id] = {...this.nodes[id], node};  // TODO(StackOverflow) Why this does not work: this.nodes[id].node = node;
    if (changedNodes.indexOf(id) < 0) {
      changedNodes.push(id);
      // console.log('masrked as changed:', node.id);
    }
    return node;
  }

  private emitChanges(changedNodes: Id[]): void {
    console.log('emitChanges()', changedNodes);
    changedNodes.forEach(id => {
      const state = this.nodes[id];
      if (state) {
        state.changed.next(state.node);
      } else {
        throw new Error('Unknown node id: ' + id);
      }
    });
  }

  public setTreeContext(tree: IDndTreeContext<Item>) { // Kinda bad - work around circular references
    this.tree = tree;
    this.spec = tree.spec;
  }

  public updateRoot(rootItem: Item): ITreeNode<Item> {
    const spec = this.spec;
    const id = spec.itemId(rootItem);
    this.rootNode = this.createNode({
      id,
      level: 0,
      tree: this.tree,
      data: rootItem,
      childrenCount: spec.childrenCount(rootItem),
    });
    const changedNodes: Id[] = [];
    this.rootNode = this.autoExpandIfApplicable(this.rootNode, changedNodes);
    this.emitChanges(changedNodes);
    return this.rootNode;
  }

  private createNode(node: Omit<ITreeNode<Item>, 'changed'>): ITreeNode<Item> {
    const changed = new Subject<ITreeNode<Item>>();
    const result = {
      node: {...node, changed: changed.asObservable()},
      changed,
    };
    this.nodes[node.id] = result;
    return result.node;
  }

  private autoExpandIfApplicable(node: ITreeNode<Item>, changedNodes: Id[]): ITreeNode<Item> {
    const {spec} = this.tree;
    let changed = false;
    if (node?.isExpanded !== false) {
      const autoExpand = spec?.autoExpand(node);
      if (autoExpand) {
        changed = true;
        node = this.expandInternal(node, changedNodes);
      } else {
        changed = true;
        node = {...node, isExpanded: false};
        if (spec.childrenCount) {
          const childrenCount = spec.childrenCount(node.data);
          node = {...node, childrenCount, hasChildren: !!childrenCount};
        } else if (spec.hasChildren) {
          node = {...node, hasChildren: spec.hasChildren(node.data)};
        }
      }
    }
    if (changed) {
      node = this.markAsChanged(node, changedNodes);
    }
    return node;
  }

  private expandInternal(node: ITreeNode<Item>, changedNodes: Id[]): ITreeNode<Item> {
    console.log('expandInternal', node.id, node.children);
    if (node.children) {
      return this.updateNodeInternal(node, {isExpanded: true}, changedNodes);
    }
    const children = this.spec.getChildItems(node.data);
    const level = node.level + 1;
    const {id, tree} = node;
    const {itemId} = this.spec;
    const next: ITreeNode<Item> = {
      ...node,
      isExpanded: true,
      childrenCount: children?.length,
      hasChildren: !!children?.length,
      children: children?.map((data, index) => this.autoExpandIfApplicable(this.createNode({
        id: itemId(data), // Get ID of newly created child nodes
        tree,
        // isExpanded: undefined,
        parent: id,
        level, index, data,
      }), changedNodes).id),
    };
    return this.markAsChanged(next, changedNodes);
  }

  public expand(id: Id): ITreeNode<Item> {
    console.log(`TreeState.expand(${id})`);
    const changedNodes: Id[] = [];
    const node = this.expandInternal(this.node(id), changedNodes);
    this.emitChanges(changedNodes);
    return node;
  }

  public collapse(id: Id): ITreeNode<Item> {
    console.log(`TreeState.collapse(${id})`,);
    return this.updateNodeInternal(this.node(id), {isExpanded: false}, [], true);
  }

  public node(id: Id): ITreeNode<Item> {
    if (!id) {
      throw new Error(`id is a required parameter, got: ${id}`);
    }
    const n = this.nodes[id];
    if (!n) {
      throw new Error(`TreeState.node(${id}): Unknown node`);
    }
    return n.node;
  }

  public move(id: Id, to: IDropTargetPosition<Item>, props?: Partial<ITreeNode<Item>>): ITreeNode<Item> {
    console.log(`move(${id}), to:`, to);
    delete this.dragging[id];
    return this.placeNode(id, to, props);
  }

  public placePreview(id: Id, to: IDropTargetPosition<Item>): ITreeNode<Item> {
    console.log(`placePreview(${id}), to:`, to); // `
    const dragging = this.dragging[id];
    if (dragging && dragging.parent === to.parent && dragging.index === to.index) {
      return this.node(id);
    }
    this.dragging[id] = to;
    this.placeNode(id, to, {isDragging: true});
    return this.node(id);
  }

  private placeNode(id: string, to: IDropTargetPosition<Item>, props?: Partial<ITreeNode<Item>>): ITreeNode<Item> {
    console.log('placeNode', id, to, props);
    const changedNodes: Id[] = [];
    let parent: ITreeNode<Item>; // Do not assign here. Make sure parent is returned from calls that may update it.

    let node = this.node(id);
    if (props) {
      node = this.markAsChanged({...node, ...props}, changedNodes);
    }

    if (node.parent === to.parent) {
      if (node.index !== to.index) {
        parent = this.node(to.parent);
        if (parent.children.indexOf(id) >= 0 && to.index >= parent.children.length) {
          throw new Error(`An attempt to insert node to the same parent`);
        }
        node = this.shiftNode(node, parent, to.index, changedNodes);
      }
    } else {
      this.removeNode(node.id, changedNodes);
      node = this.insertNode(node, to.parent, to.index, changedNodes);
    }
    parent = this.node(to.parent); // Make sure we are taking latest state of parent
    { // validate changes
      if (node.parent !== to.parent) {
        throw new Error(`node.parent !== to.parent: ${node.parent} !== ${to.parent}`);
      }
      if (node.index !== to.index) {
        throw new Error(`node.index !== to.index: ${node.index} !== ${to.index}`);
      }
      const index = parent.children.indexOf(id);
      if (node.index !== index) {
        throw new Error(`node.index !== parent.children.indexOf(id): ${node.index} !== ${index}`);
      }
    }
    this.emitChanges(changedNodes);
    console.log('placed:', node);
    return node;
  }

  private insertNode(node: ITreeNode<Item>, parentId: Id, index: number, changedNodes: Id[])
    : ITreeNode<Item> {
    let parent = this.node(parentId);
    console.log('insertNode', node.id, node.index, parent.id, index, parent.children);
    if (parent.children?.indexOf(node.id) >= 0) {
      console.error('An attempt to insert duplicate child node');
      return;
    }
    const children = parent.children
      ? [
        ...parent.children.slice(0, index),
        node.id,
        ...parent.children.slice(index),
      ]
      : [node.id];
    parent = this.markAsChanged({
      ...parent,
      children,
      childrenCount: children.length,
      hasChildren: true,
    }, changedNodes);
    node = this.markAsChanged({
      ...node,
      parent: parent.id,
      level: parent.level + 1,
      index,
    }, changedNodes);
    // Update nodes that are after the point of insertion (as they shifted and indexes increased by 1)
    this.updateChildren(parent.children, index, parent.children.length - 1, changedNodes);
    return node;
  }

  private shiftNode(node: ITreeNode<Item>, parent: ITreeNode<Item>, index: number, changedNodes: Id[])
    : ITreeNode<Item> {
    const {id} = node;
    const oldIndex = parent.children?.indexOf(id);
    if (!(oldIndex >= 0)) {
      throw new Error(`Node "${id}" does not belong to ${parent.id}`);
    }
    console.log('shiftNode', oldIndex, index);
    const children = [...parent.children];
    children.splice(oldIndex, 1);
    children.splice(index, 0, id);
    node = this.markAsChanged({...node, index}, changedNodes);
    this.markAsChanged({...parent, children}, changedNodes);
    this.updateChildren(children, oldIndex, index, changedNodes);
    return node;
  }

  private updateChildren(children: readonly string[], from: number, to: number, changedNodes: Id[]): void {
    console.log('updateChildren', children, from, to);
    if (to < from) {
      [from, to] = [to, from];
    }
    if (to > children.length) {
      throw new Error(`Out of range: children.length=${children.length}, from=${from}, to=${to}`);
    }
    for (let i = from; i <= to; i++) {
      const child = children[i];
      if (!child) {
        throw new Error(`Empty child at index ${i}, children: ["${children.join('","')}"], from=${from}, to=${to}`);
      }
      const node = this.node(children[i]);
      if (node.index !== i) {
        this.markAsChanged({...node, index: i}, changedNodes);
      }
    }
  }

  private removeNode(id: string, changedNodes: Id[]): void {
    const node = this.node(id);
    if (!node.parent) {
      throw new Error('Attempt to delete a node not linked to a parent: ' + id);
    }
    const parent = this.node(node.parent);
    if (!parent) {
      throw new Error('parent not found by id');
    }
    let {children} = parent;
    if (!children) {
      return;
    }

    const index = children.indexOf(id);
    if (index >= 0) {
      children = [
        ...children.slice(0, index),
        ...children.slice(index + 1).map((child, i) => {
          this.markAsChanged({...this.node(child), index: index + i}, changedNodes);
          return child;
        }),
      ];
    }
    console.log(`removeNode(id=${id}, parent=${parent?.id})`, children); // `
    this.markAsChanged({
      ...parent,
      children,
      childrenCount: children.length,
      hasChildren: !!children.length
    }, changedNodes);
  }

  public updateNode(id: Id, props: Partial<ITreeNode<Item>>): ITreeNode<Item> {
    console.log('updateNode', id, props);
    return this.updateNodeInternal(this.node(id), props, [], true);
  }

  private updateNodeInternal(prev: ITreeNode<Item>, props: Partial<ITreeNode<Item>>,
                             changedNodes: Id[], emitChanges?: boolean): ITreeNode<Item> {
    if (!prev) {
      throw new Error('Missing required parameter: prev');
    }
    if (!props) {
      throw new Error('Missing required parameter: props');
    }
    console.log('updating with', props, ', prev:', prev);
    const node = this.markAsChanged({...prev, ...props}, changedNodes);
    if (emitChanges) {
      this.emitChanges(changedNodes);
    }
    return node;
  }
}
