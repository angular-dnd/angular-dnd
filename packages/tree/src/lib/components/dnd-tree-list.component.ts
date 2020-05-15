import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, TemplateRef} from '@angular/core';
import {ITreeContext, ITreeNode} from '../interfaces-tree';
import {Subscription} from 'rxjs';
import {filter} from 'rxjs/operators';

// noinspection AngularUndefinedBinding
@Component({
  selector: 'ngx-dnd-tree-list',
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
    <ngx-dnd-tree-item *ngFor="let child of children; let i = index; trackBy: trackByVal"
                       [tree]="tree" [index]="i" [nodeId]="child" [itemTemplate]="itemTemplate"
    ></ngx-dnd-tree-item>
  `,
})
export class DndTreeListComponent<Item> implements OnChanges, OnInit, OnDestroy {

  @Input() parentNode: ITreeNode<Item>;

  public tree: ITreeContext<Item>;

  public itemTemplate: TemplateRef<ITreeNode<Item>>;
  // nodes: readonly ITreeNode<Item>[];
  public children: readonly string[];

  private sub: Subscription;

  constructor(
    // protected readonly cdr: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    if (!this.tree) {
      throw new Error('You must provide a [tree] context');
    }
  }

  ngOnChanges({parentNode}: SimpleChanges): void {
    if (parentNode) {
      this.unsubscribe();
      if (parentNode.currentValue) {
        console.log('DndTreeListComponent.ngOnChanges() => parentNode:',
          this.parentNode.id, parentNode.currentValue === parentNode.previousValue);
        this.setParent(this.parentNode);
        this.subscribeForParentChangesIfNotYet();
      } else {
        this.unsubscribe();
      }
    }
  }

  private subscribeForParentChangesIfNotYet(): void {
    console.log('subscribeForParentChangesIfNotYet()', this.sub);
    if (this.sub) { // No need to subscribe multiple times
      return;
    }
    this.sub = this.parentNode.changed
      .pipe(filter(n => n !== this.parentNode))
      .subscribe(n => {
        console.log('DndTreeListComponent => parent changed:', n.id, n.children);
        this.setParent(n);
      });
  }

  private setParent(parent: ITreeNode<Item>): void {
    const {id, tree, children} = parent;
    if (children.indexOf(id) >= 0) {
      console.error('circular reference parent is child to itself', id, children);
      return;
    }
    console.log(`DndTreeListComponent.setParent()`, id, children);
    this.children = children;
    this.tree = tree;
    this.itemTemplate = tree.itemTemplate;
    if (!this.itemTemplate) {
      console.error('!this.itemTemplate', id);
    }
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

  trackById = (_, node: ITreeNode<Item>) => node.id;
  trackByVal = (_, id: string) => id;
}
