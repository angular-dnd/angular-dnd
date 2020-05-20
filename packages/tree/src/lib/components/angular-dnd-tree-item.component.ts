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
import {Id, ITreeContext, ITreeNode} from '../interfaces-tree';
import {DragSource, DragSourceMonitor, DropTarget, DropTargetMonitor, AngularDndService} from '@angular-dnd/core';
import {IDraggedTreeItem, IDropTargetPosition, ISize} from '../interfaces-dnd';
import {Subscription} from 'rxjs';
import {DefaultDropStrategy} from '../drop-strategy';

let prevHovered: string;

// noinspection AngularUndefinedBinding
@Component({
  selector: 'angular-dnd-tree-item',
  template: `
    <div #dragAndDrop style="border: 1px dashed lightgray">
      <ng-container *ngTemplateOutlet="itemTemplate; context: {$implicit: node}"></ng-container>
    </div>
    <!--		<div [dndTreeItem]="node" #dndTreeItem="dndTreeItem" *ngIf="node">-->
    <!--			<ng-container *ngTemplateOutlet="itemTemplate; context: {$implicit: node}"></ng-container>-->
    <!--		</div>-->
  `,
})
export class AngularDndTreeItemComponent<Item> implements OnInit, OnChanges {
  @Input() public tree: ITreeContext<Item>;
  @Input() public nodeId;
  @Input() public index: number;
  @Input() public itemTemplate: TemplateRef<ITreeNode<Item>>;

  @ViewChild('dragAndDrop', {static: true}) dragDropElRef: ElementRef;

  private isProcessingHover: boolean;

  dragSourceType = 'any_item';
  private readonly subs = new Subscription();
  private readonly dragSource = this.createDragSource();
  private readonly dropTarget = this.createDropTarget();

  public node: ITreeNode<Item>;
  private sub: Subscription;

  private defaultDropStrategy = new DefaultDropStrategy<Item>();

  constructor(
    private readonly dnd: AngularDndService,
    private readonly el: ElementRef<HTMLElement>,
    protected readonly cdr: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    // console.log('ngOnInit', this.dragDropElRef);
    const dragDropNativeEl = this.dragDropElRef.nativeElement;
    this.subs.add(this.dragSource.connectDragSource(dragDropNativeEl, {
      dropEffect: 'move',
    }));
    this.subs.add(this.dropTarget.connectDropTarget(dragDropNativeEl));
  }

  ngOnChanges({nodeId}: SimpleChanges) {
    if (nodeId) {
      this.setNode(this.nodeId ? this.tree.state.node(this.nodeId) : undefined);
    }
  }

  private setNode(node: ITreeNode<Item>): void {
    console.log('setNode', node.id);
    this.node = node;
    if (!this.sub) {
      this.sub = node.changed.subscribe(n => {
        if (n.id !== node.id || n.id !== this.node.id) {
          console.error(`DndTreeItemComponent: node.changed => n.id !== node.id != this.node.id`,
            n.id, node.id, this.node.id);
          return;
        }
        console.log(`DndTreeItemComponent: node => ${n.id}: children=`, n.children && [...n.children]);
        this.node = n;
        this.cdr.markForCheck();
      });
    }
  }

  private createDragSource(): DragSource<IDraggedTreeItem<Item>> {
    console.log('DndTreeItemComponent.createDragSource()');
    return this.dnd.dragSource<IDraggedTreeItem<Item>>(this.dragSourceType, {
      canDrag: (): boolean => true,
      beginDrag: (_: DragSourceMonitor<void, void>): IDraggedTreeItem<Item> => {
        console.log('DndTreeDirective.beginDrag');
        this.node = this.tree.state.updateNode(this.node.id, {isDragging: true})
        return {
          node: this.node,
          // size: this.size(),
        };
      },
      endDrag: (monitor: DragSourceMonitor<IDraggedTreeItem<Item>>): void => {
        this.endDrag(monitor);
      },
      isDragging: (_: DragSourceMonitor<IDraggedTreeItem<Item>, void>): boolean => {
        console.log('DndTreeItemComponent.isDragging');
        return this.node.isDragging;
      }
    });
  }

  private endDrag = (monitor: DragSourceMonitor<IDraggedTreeItem<Item>>): void => {
    const dragged = monitor.getItem();
    console.log('endDrag()', dragged);
    if (this.node.isDragging) {
      dragged.node.tree.state.move(dragged.node.id,
        {parent: dragged.node.parent, index: dragged.node.index},
        {isDragging: false},
      );
    }
  }

  private createDropTarget(): DropTarget<IDraggedTreeItem<Item>> {
    const dropTarget = this.dnd.dropTarget<IDraggedTreeItem<Item>>(this.dragSourceType, {
      canDrop: m => this.canDrop(m),
      hover: m => this.hover(m),
      drop: m => this.drop(m),
    });
    dropTarget.listen(m => m.isOver({shallow: true}))
    return dropTarget;
  }

  private drop = (monitor: DropTargetMonitor<IDraggedTreeItem<Item>>): void | {} => {
    console.log('drop');
    const node = this.node;
    const dragged = monitor.getItem()
    const {id} = dragged.node;
    console.log(`DndTreeItemDirective.drop(${id}) => to:`, node.id);
    const {state} = this.tree;
    const draggedNode = dragged.node.tree.state.node(id);
    if (draggedNode.isDragging) {
      const to = this.defaultDropStrategy.suggestDropPosition(monitor, this);
      console.log(`drop handler by "${this.node.id}" suggested to:`, to);
      if (this.isAlreadyInPlace(id, to)) { // No need to move node if it's already in place
        state.updateNode(id, {isDragging: false});
      } else {
        node.tree.state.move(id, {
          parent: this.node.parent,
          index: this.node.index
        }, {isDragging: false});
      }
    }
    return
  }

  private canDrop = (monitor: DropTargetMonitor<IDraggedTreeItem<Item>>): boolean => {
    const to = this.defaultDropStrategy.suggestDropPosition(monitor, this);
    return this.defaultDropStrategy.canDrop(monitor, to, this.node.tree.state);
  };

  private hover = (monitor: DropTargetMonitor<IDraggedTreeItem<Item>>): void => {
    try {
      if (!this.isProcessingHover && monitor.isOver({shallow: true})) {
        this.isProcessingHover = true;
        console.log('DndTreeItemComponent.hover()', this.node.id);
        const to = this.defaultDropStrategy.suggestDropPosition(monitor, this);
        if (this.node.id !== prevHovered) {
          prevHovered = this.node.id;
        }
        const draggedNode = monitor.getItem().node;
        if (to && !this.isAlreadyInPlace(draggedNode.id, to)) {
          console.log(`hovered over:`, this.node.id, 'suggested:', to);
          this.tree.state.placePreview(draggedNode.id, to);
        }
        this.isProcessingHover = false;
      }
    } catch (e) {
      console.error('Failed to process hover:', e);
      this.isProcessingHover = false;
    }
  }

  private isAlreadyInPlace(id: Id, to: IDropTargetPosition<Item>): boolean {
    const parent = this.tree.state.node(to.parent);
    return parent?.children?.indexOf(id) === to.index;
  }

  public rect = (): DOMRect | ClientRect => this.el.nativeElement.getBoundingClientRect();

  public size = (): ISize => {
    const r = this.rect();
    return {width: r.width || r.right - r.left, height: r.height || r.bottom - r.top};
  }
}
