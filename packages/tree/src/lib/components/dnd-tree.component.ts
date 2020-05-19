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
import {Id, ITreeContext, ITreeNode} from '../interfaces-tree';
import {IDndTreeSpec} from '../interfaces-dnd';
import {TreeState} from '../tree-state';
import {Subscription} from 'rxjs';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[angularDndTreeItem]',
  // exportAs: 'treeItem',
})
export class TreeItemTemplateDirective<Item> {
  @Input() public item: Item;
}

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[dragPreview]',
  // exportAs: 'dragPreview',
})
export class DragPreviewTemplateDirective<Item> {
  @Input() public node: ITreeNode<Item>;
}

@Component({
  selector: 'angular-dnd-tree',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <angular-dnd-tree-list *ngIf="rootNode && tree" [parentNode]="rootNode"></angular-dnd-tree-list>
  `,
})
export class DndTreeComponent<Item> implements OnChanges, AfterContentInit {

  @Input() treeId: Id;
  @Input() rootItem: Item;
  @Input() spec: IDndTreeSpec<Item>;
  public tree: ITreeContext<Item>;
  public rootNode: ITreeNode<Item>;
  public treeState: TreeState<Item>;

  @ContentChild(TreeItemTemplateDirective, {read: TemplateRef}) itemTemplate;
  @ContentChild(DragPreviewTemplateDirective, {read: TemplateRef}) previewTemplate;

  constructor(
    // private readonly zone: NgZone,
    protected readonly cdr: ChangeDetectorRef,
  ) {
  }

  private subTreeChanged: Subscription;

  ngOnChanges({rootItem, treeId, spec}: SimpleChanges): void {
    if (treeId || spec) {
      const state = new TreeState<Item>();
      this.tree = {id: this.treeId, spec: this.spec, itemTemplate: this.itemTemplate, state};
      state.setTreeContext(this.tree);
      this.treeState = state;

    }
    if (rootItem && this.itemTemplate) {
      this.rootNode = this.treeState.updateRoot(this.rootItem)
      this.subscribeForStateChanges();
    }
  }

  private subscribeForStateChanges(): void {
    console.log('DndTreeComponent.subscribeForStateChanges()');
    if (this.subTreeChanged) {
      this.subTreeChanged.unsubscribe();
    }
    this.subTreeChanged = this.rootNode.changed
      .subscribe(rootNode => {
        try {
          console.log('DndTreeComponent => rootNode changed', rootNode);
          this.rootNode = rootNode;
          this.cdr.markForCheck();
        } catch (e) {
          console.error('Failed to process root changed event', e);
        }
      });
  }

  ngAfterContentInit(): void {
    this.tree = {...this.tree, itemTemplate: this.itemTemplate};
    this.treeState.setTreeContext(this.tree);
    this.rootNode = this.treeState.updateRoot(this.rootItem);
  }
}
