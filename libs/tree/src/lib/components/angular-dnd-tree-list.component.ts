import {Component, Input, OnChanges, OnDestroy, SimpleChanges, TemplateRef} from '@angular/core';
import {ITreeContext, ITreeNode} from '@sneat-dnd/tree';
import {Subscription} from 'rxjs';
import {filter} from 'rxjs/operators';
import {IAngularDndTreeContext} from '../angular-dnd-tree-context';

// noinspection AngularUndefinedBinding
@Component({
  selector: 'angular-dnd-tree-list',
  styles: [`
    .dndItem {
      padding-top: 5px;
      padding-bottom: 5px;
    }

    .dndItem:first-child {
      padding-top: 10px
    }

    .dndItem:last-child {
      padding-bottom: 10px
    }
  `],
  template: `
    <!--		<div *ngFor="let node of nodes; let i = index; trackBy: trackById" [dndTreeItem]="node" #dndTreeItem="dndTreeItem"-->
    <!--			  class="dndItem">-->
    <!--			&lt;!&ndash; <dnd-tree-item [treeId]="treeId" [item]="item" [index]="i" [itemsCount]="items.length" [itemTemplate]="itemTemplate">&ndash;&gt;-->
    <!--			&lt;!&ndash; </dnd-tree-item>&ndash;&gt;-->
    <!--			<ng-container *ngTemplateOutlet="itemTemplate; context: {$implicit: dndTreeItem.node}"></ng-container>-->
    <!--		</div>-->
    <angular-dnd-tree-item
      *ngFor="let child of children; let i = index; trackBy: trackByVal"
      [tree]="tree"
      [index]="i"
      [nodeId]="child"
      [itemTemplate]="itemTemplate"
    ></angular-dnd-tree-item>
  `,
})
export class AngularDndTreeListComponent<Item> implements OnChanges, OnDestroy {

  @Input() parentNode?: ITreeNode<Item>;

  public tree?: ITreeContext<Item>;

  public itemTemplate: TemplateRef<ITreeNode<Item>> | null = null;

  // nodes: readonly ITreeNode<Item>[];
  public children: readonly string[] = [];

  private sub?: Subscription;

  ngOnChanges(changes: SimpleChanges): void {
    console.log('AngularDndTreeListComponent.ngOnChanges(), parentNode:', changes);
    const {parentNode} = changes;
    if (parentNode) {
      this.unsubscribe();
      if (this.parentNode) {
        // console.log('DndTreeListComponent.ngOnChanges() => parentNode:',
        //   this.parentNode.id, parentNode.currentValue === parentNode.previousValue);
        this.setParent(this.parentNode);
        this.setTreeAndTemplate();
        this.subscribeForParentChangesIfNotYet();
      }
    }
  }

  private setTreeAndTemplate(): void {
    if (!this.parentNode) {
      return;
    }
    const {tree} = this.parentNode;
    this.tree = tree;
    this.itemTemplate = (tree as IAngularDndTreeContext<Item>).itemTemplate;
    if (!this.itemTemplate) {
      console.warn(`tree context has no itemTemplate, itemID=${this.parentNode.id}, treeID=${tree.id}`, tree);
    }
  }

  private subscribeForParentChangesIfNotYet(): void {
    // console.log('subscribeForParentChangesIfNotYet()', this.sub);
    if (this.sub) { // No need to subscribe multiple times
      return;
    }
    this.sub = this.parentNode?.changed
      .pipe(filter(n => n !== this.parentNode))
      .subscribe(n => {
        console.log('DndTreeListComponent => parent changed:', n.id, n.children);
        this.setParent(n);
      });
  }

  private setParent(parent: ITreeNode<Item>): void {
    if (!parent) {
      this.children = [];
      return;
    }
    const {id, /*tree,*/ children} = parent;
    if (children && children.indexOf(id) >= 0) {
      console.error('circular reference parent is child to itself', id, children);
      return;
    }
    console.log(`DndTreeListComponent.setParent()`, id, children);
    this.children = children || [];
    // const items = this.tree.spec.getChildren(parent.data);
    // this.itemsCount = items?.length;
    // this.nodes = children.map(child => this.tree.state.node(child));
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  private unsubscribe(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  trackById = (_: number, node: ITreeNode<Item>) => node.id;
  trackByVal = (_: number, id: string) => id;
}
