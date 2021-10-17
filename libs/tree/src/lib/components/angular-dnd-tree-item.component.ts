import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {AngularDndService} from '@angular-dnd/core';
import {IDragSource, IDragSourceMonitor} from '@sneat-dnd/core';
import {IDropTarget, IDropTargetMonitor} from '@sneat-dnd/core';
import {Subscription} from 'rxjs';
import {IDraggedTreeItem, IDropTargetPosition, ISize} from '@sneat-dnd/tree';
import {Id, ITreeContext, ITreeNode} from '@sneat-dnd/tree';
import {DefaultDropStrategy} from '@sneat-dnd/tree';

let prevHovered: string;

// noinspection AngularUndefinedBinding
@Component({
  selector: 'angular-dnd-tree-item',
  template: `
    <div #dragAndDrop class="dnd-tree-item">
      <ng-container *ngTemplateOutlet="itemTemplate; context: {$implicit: node}"></ng-container>
    </div>
    <!--		<div [dndTreeItem]="node" #dndTreeItem="dndTreeItem" *ngIf="node">-->
    <!--			<ng-container *ngTemplateOutlet="itemTemplate; context: {$implicit: node}"></ng-container>-->
    <!--		</div>-->
  `,
})
export class AngularDndTreeItemComponent<Item> implements OnInit, OnChanges {

  @Input() public tree?: ITreeContext<Item>;
  @Input() public nodeId?: string;
  @Input() public index?: number;
  @Input() public itemTemplate: TemplateRef<ITreeNode<Item>> | null = null;

  @ViewChild('dragAndDrop', {static: true}) dragDropElRef?: ElementRef;

  private isProcessingHover = false;

  dragSourceType = 'any_item';
  private readonly subs = new Subscription();
  private readonly dragSource = this.createDragSource();
  private readonly dropTarget = this.createDropTarget();

  public node?: ITreeNode<Item>;
  private sub?: Subscription;

  private defaultDropStrategy = new DefaultDropStrategy<Item>();

  constructor(
    private readonly dnd: AngularDndService,
    private readonly el: ElementRef<HTMLElement>,
    protected readonly cdr: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    // console.log('ngOnInit', this.dragDropElRef);
    const dragDropNativeEl = this.dragDropElRef?.nativeElement;
    this.subs.add(this.dragSource.connectDragSource(dragDropNativeEl, {
      dropEffect: 'move',
    }));
    this.subs.add(this.dropTarget.connectDropTarget(dragDropNativeEl));
  }

  ngOnChanges({nodeId}: SimpleChanges) {
    if (nodeId) {
      this.setNode(this.nodeId ? this.tree?.state.node(this.nodeId) : undefined);
    }
  }

  private setNode(node?: ITreeNode<Item>): void {
    console.log('setNode', node?.id);
    this.node = node;
    if (!this.sub && node) {
      this.sub = node.changed.subscribe((n: ITreeNode<Item>) => {
        if (n.id !== node.id || n.id !== node.id) {
          console.error(`DndTreeItemComponent: node.changed => n.id !== node.id != this.node.id`,
            n.id, node.id, node.id);
          return;
        }
        console.log(`DndTreeItemComponent: node => ${n.id}: children=`, n.children && [...n.children]);
        this.node = n;
        this.cdr.markForCheck();
      });
    }
  }

  private createDragSource(): IDragSource<IDraggedTreeItem<Item>> {
    // console.log('DndTreeItemComponent.createDragSource()');
    return this.dnd.dragSource<IDraggedTreeItem<Item>>(this.dragSourceType, {
      canDrag: (): boolean => true,
      beginDrag: (_: IDragSourceMonitor<void, void>): IDraggedTreeItem<Item> => {
        // console.log('DndTreeDirective.beginDrag');
        if (!this.node) {
          throw new Error('can not beginDrag as this.node is undefined');
        }
        this.node = this.tree?.state.updateNode(this.node.id, {isDragging: true});
        if (!this.node) {
          throw new Error('this.node is undefined after updateNode()');
        }
        return {
          node: this.node,
          // size: this.size(),
        };
      },
      endDrag: (monitor: IDragSourceMonitor<IDraggedTreeItem<Item>>): void => {
        this.endDrag(monitor);
      },
      isDragging: (_: IDragSourceMonitor<IDraggedTreeItem<Item>, void>): boolean => {
        // console.log('DndTreeItemComponent.isDragging');
        return !!this.node?.isDragging;
      }
    });
  }

  private endDrag = (monitor: IDragSourceMonitor<IDraggedTreeItem<Item>>): void => {
    const dragged = monitor.getItem();
    if (dragged && this.node?.isDragging) {
      console.log('endDrag()', dragged);
      dragged.node.tree.state.move(dragged.node.id,
        {parent: dragged.node.parent, index: dragged.node.index},
        {isDragging: false},
      );
    }
  }

  private createDropTarget(): IDropTarget<IDraggedTreeItem<Item>> {
    const dropTarget = this.dnd.dropTarget<IDraggedTreeItem<Item>>(this.dragSourceType, {
      canDrop: m => this.canDrop(m),
      hover: m => this.hover(m),
      drop: m => this.drop(m),
    });
    dropTarget.listen(m => m.isOver({shallow: true}));
    return dropTarget;
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  private drop = (monitor: IDropTargetMonitor<IDraggedTreeItem<Item>>): void | {} => {
    const node = this.node;
    if (!node) {
      return;
    }
    const dragged = monitor.getItem();
    if (!dragged) {
      return;
    }
    const {id} = dragged.node;
    console.log(`AngularDndTreeItemComponent.drop(${id}) => to:`, node?.id);
    if (!this.tree) {
      return;
    }
    const {state} = this.tree;
    const draggedNode = dragged.node.tree.state.node(id);
    if (draggedNode.isDragging) {
      const to = this.defaultDropStrategy.suggestDropPosition(monitor, {node, rect: this.rect});
      console.log(`drop handler by "${this.node?.id}" suggested to:`, to);
      // if (this.isAlreadyInPlace(id, to)) { // No need to move node if it's already in place
      //   state.updateNode(id, {isDragging: false});
      // } else {
      //   state.move(id, {
      //     parent: this.node.parent,
      //     index: this.node.index
      //   }, {isDragging: false});
      // }
      state.move(id, to, {isDragging: false});
    }
    return;
  }

  private canDrop = (monitor: IDropTargetMonitor<IDraggedTreeItem<Item>>): boolean => {
    if (!this.node) {
      return false;
    }
    const to = this.defaultDropStrategy.suggestDropPosition(monitor, {node: this.node, rect: this.rect});
    const item = monitor.getItem()
    return !!item && this.defaultDropStrategy.canDrop(item, to, this.node.tree.state);
  }

  private hover = (monitor: IDropTargetMonitor<IDraggedTreeItem<Item>>): void => {
    try {
      if (!this.node) {
        return;
      }
      if (!this.isProcessingHover && monitor.isOver({shallow: true})) {
        this.isProcessingHover = true;
        console.log('DndTreeItemComponent.hover()', this.node?.id);
        const to = this.defaultDropStrategy.suggestDropPosition(monitor, {node: this.node, rect: this.rect});
        if (this.node?.id && this.node.id !== prevHovered) {
          prevHovered = this.node.id;
        }
        const draggedNode = monitor.getItem()?.node;
        if (!draggedNode) {
          return;
        }
        if (to && !this.isAlreadyInPlace(draggedNode.id, to)) {
          console.log(`hovered over:`, this.node?.id, 'suggested:', to);
          this.tree?.state.placePreview(draggedNode.id, to);
        }
        this.isProcessingHover = false;
      }
    } catch (e) {
      console.error('Failed to process hover:', e);
      this.isProcessingHover = false;
    }
  }

  private isAlreadyInPlace(id: Id, to: IDropTargetPosition<Item>): boolean {
    const parent = to.parent && this.tree?.state.node(to.parent);
    return !!parent && parent.children?.indexOf(id) === to.index;
  }

  public rect = (): DOMRect | ClientRect => this.el.nativeElement.getBoundingClientRect();

  public size = (): ISize => {
    const r = this.rect();
    return {width: r.width || r.right - r.left, height: r.height || r.bottom - r.top};
  }
}
