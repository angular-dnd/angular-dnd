import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  Directive,
  Input,
  OnChanges,
  SimpleChanges,
  TemplateRef
} from '@angular/core';
import {Output} from '@angular/core';
import {EventEmitter} from '@angular/core';
import {OnDestroy} from '@angular/core';
import {Id, IDndTreeSpec, IDraggedTreeItem, ITreeNode, TreeState} from '@sneat-dnd/tree';
import {Subscription} from 'rxjs';
import {IAngularDndTreeContext} from '../angular-dnd-tree-context';
import {IMovedTreeItem} from '@sneat-dnd/tree';
import {ITreeState} from '@sneat-dnd/tree/lib/interfaces-dnd';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[angularDndTreeItem]',
  // exportAs: 'treeItem',
})
export class TreeItemTemplateDirective<Item> {
  @Input() public item?: Item;
}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[dragPreview]',
  // exportAs: 'dragPreview',
})
export class DragPreviewTemplateDirective<Item> {
  @Input() public node?: ITreeNode<Item>;
}

@Component({
  selector: 'angular-dnd-tree',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngIf="!itemTemplate" style="color: red; background-color: white">angular-dnd-tree: item template is not set
    </div>
    <angular-dnd-tree-list *ngIf="rootNode && tree?.itemTemplate" [parentNode]="rootNode"></angular-dnd-tree-list>
  `,
})
export class AngularDndTreeComponent<Item> implements OnChanges, AfterContentInit, OnDestroy {

  private subs = new Subscription();

  @Input() treeId?: Id;
  @Input() rootItem?: Item;
  @Input() spec?: IDndTreeSpec<Item>;
  public tree?: IAngularDndTreeContext<Item>;
  public rootNode?: ITreeNode<Item>;
  public treeState?: TreeState<Item>;

  @ContentChild(TreeItemTemplateDirective, {
    read: TemplateRef,
    static: true
  }) itemTemplate?: TemplateRef<ITreeNode<Item>>;
  @ContentChild(DragPreviewTemplateDirective, {
    read: TemplateRef,
    static: true
  }) previewTemplate?: TemplateRef<ITreeNode<Item>>;

  @Output() moved = new EventEmitter<IDraggedTreeItem<Item>>();

  constructor(
    protected readonly cdr: ChangeDetectorRef,
  ) {
  }

  ngAfterContentInit(): void {
    console.log('AngularDndTreeComponent.ngAfterContentInit()');
    // this.setupTree();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('ngOnChanges', Object.keys(changes));
    const {rootItem, treeId, spec} = changes;
    if (treeId || spec) {
      this.setupTree();
    }
    console.log('ngOnChanges => tree:', this.tree?.itemTemplate, this.itemTemplate);
    if (rootItem) {
      this.onRootChanged();
    }
  }

  private setupTree(): void {
    if (!this.tree || !this.treeId || !this.spec || !this.itemTemplate) {
      return;
    }
    this.tree = {
      id: this.treeId,
      spec: this.spec,
      itemTemplate: this.itemTemplate,
      state: undefined as unknown as ITreeState<Item>,
    };
    this.treeState = new TreeState<Item>({
      id: this.tree.id,
      spec: this.spec,
    });
    this.tree = this.treeState.tree as IAngularDndTreeContext<Item>;
    console.log('AngularDndTreeComponent.setupTree()', this.itemTemplate, 'root=', {...this.rootItem}, 'treeContext=', {...this.tree});
    this.subscribeForStateChanges();
    this.cdr.markForCheck();
  }

  private onRootChanged(): void {
    console.log('onRootChanged()', {...this.treeState}, this.rootNode, this.rootItem);
    if (this.treeState && this.rootItem) {
      this.rootNode = this.treeState.updateRoot(this.rootItem);
      this.cdr.markForCheck();
    }
  }

  private onMoved = (moved: IMovedTreeItem<Item>) => {
    try {
      const {parent, index} = moved?.node;
      console.log('AngularDndTreeComponent.moved', moved.node.id, 'from', moved.from, 'to', {parent, index});
      this.moved.emit(moved);
    } catch (e) {
      console.error('failed to process "moved" event:', e);
    }
  }

  private subscribeForStateChanges(): void {
    console.log('DndTreeComponent.subscribeForStateChanges()', this.rootNode);
    this.subs.unsubscribe();
    this.subs = new Subscription();

    const sub = this.treeState?.moved.subscribe(moved => this.onMoved(moved));
    this.subs.add(sub);

    if (this.rootNode) {
      this.subs.add(this.rootNode.changed
        .subscribe(rootNode => {
          try {
            // console.log('DndTreeComponent => rootNode changed', rootNode);
            this.rootNode = rootNode;
            this.cdr.markForCheck();
          } catch (e) {
            console.error('Failed to process root changed event', e);
          }
        }));
    }
  }

  ngOnDestroy() {
    this.subs?.unsubscribe();
  }
}
