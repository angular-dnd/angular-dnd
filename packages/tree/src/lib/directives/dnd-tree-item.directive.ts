// import {
// 	AfterContentInit,
// 	Directive,
// 	ElementRef,
// 	Input,
// 	OnChanges,
// 	OnDestroy,
// 	OnInit,
// 	SimpleChanges
// } from '@angular/core';
// import {Subscription} from 'rxjs';
// import {DragSource, DragSourceMonitor, DropTarget, DropTargetMonitor, SkyhookDndService} from '@angular-dnd/core';
// import {Id, ITreeNode} from '../interfaces-tree';
// import {IDraggedTreeItem, ISize} from '../interfaces-dnd';
//
// @Directive({
// 	// tslint:disable-next-line:directive-selector
// 	selector: '[dndTreeItem]',
// 	exportAs: 'dndTreeItem',
// })
// export class DndTreeItemDirective<Item> implements OnInit, OnDestroy, AfterContentInit, OnChanges {
//
// 	private readonly subs = new Subscription();
//
// 	dragSourceType = 'any_item';
//
// 	private readonly dragSource = this.createDragSource();
// 	private readonly dropTarget = this.createDropTarget();
//
// 	private lastCantDropReason: string;
// 	private lastCantDropDraggedId: Id;
//
// 	@Input('dndTreeItem') public node: ITreeNode<Item>;
//
// 	constructor(
// 		private dnd: SkyhookDndService,
// 		private el: ElementRef<HTMLElement>,
// 		// protected cdr: ChangeDetectorRef,
// 	) {
// 		// console.log('DndTreeItemDirective.constructor(), el:', this.el);
// 	}
//
// 	ngOnChanges(changes: SimpleChanges): void {
// 		// console.log('ngOnChanges', changes);
// 		if (changes.node && this.node) {
// 			this.setNode(this.node);
// 		}
// 	}
//
// 	protected setNode(node: ITreeNode<Item>): void {
// 		if (node.parent && !node.tree.state.node(node.parent).children) {
// 			console.error(`parent node "${node.parent}" of "${node.id}" does not have children`, node);
// 		}
// 		this.node = {...node, dropTarget: this.dropTarget};
// 	}
//
// 	ngOnInit(): void {
// 		if (this.node) {
// 			this.subs.add(this.dragSource.connectDragSource(this.el.nativeElement, {
// 				dropEffect: 'move',
// 			}));
// 			this.subs.add(this.dropTarget.connectDropTarget(this.el.nativeElement));
// 		} else {
// 			console.error('You must pass [dndTreeItem]="dndTree.context"');
// 		}
// 	}
//
// 	ngAfterContentInit(): void {
// 	}
//
// 	ngOnDestroy() {
// 		this.dragSource.unsubscribe();
// 		this.dropTarget.unsubscribe();
// 		this.subs.unsubscribe();
// 	}
//
// 	private createDragSource(): DragSource<IDraggedTreeItem<Item>> {
// 		// console.log('DndTreeDirective.createDragSource()');
// 		return this.dnd.dragSource<IDraggedTreeItem<Item>>(this.dragSourceType, {
// 			canDrag: (): boolean => true,
// 			beginDrag: (_: DragSourceMonitor<void, void>): IDraggedTreeItem<Item> => {
// 				console.log('DndTreeDirective.beginDrag');
// 				this.node = this.node.tree.state.updateNode(this.node.id, {isDragging: true})
// 				return {
// 					node: this.node,
// 					// size: this.size(),
// 				};
// 			},
// 			endDrag: (monitor: DragSourceMonitor<IDraggedTreeItem<Item>>): void => {
// 				this.endDrag(monitor);
// 			},
// 			isDragging: (monitor: DragSourceMonitor<IDraggedTreeItem<Item>, void>): boolean => {
// 				console.log('DndTreeDirective.isDragging');
// 				return this.node.isDragging;
// 			}
// 		});
// 	}
//
// 	private createDropTarget(): DropTarget<IDraggedTreeItem<Item>> {
// 		const dropTarget = this.dnd.dropTarget<IDraggedTreeItem<Item>>(this.dragSourceType, {
// 			canDrop: m => this.canDrop(m, this.node),
// 			hover: m => this.hover(m),
// 			drop: m => this.drop(m),
// 		});
// 		dropTarget.listen(m => m.isOver({shallow: true}))
// 		return dropTarget;
// 	}
//
// 	private endDrag = (monitor: DragSourceMonitor<IDraggedTreeItem<Item>>): void => {
// 		const dragged = monitor.getItem();
// 		console.log('endDrag()', dragged);
// 		if (this.node.isDragging) {
// 			this.node = {...dragged.node, isDragging: false};
// 			dragged.node.tree.state.move(dragged.node, {parent: dragged.node.parent, index: dragged.node.index});
// 		}
// 	}
//
// 	private drop = (monitor: DropTargetMonitor<IDraggedTreeItem<Item>>): void | {} => {
// 		const dragged = monitor.getItem();
// 		console.log(`DndTreeItemDirective.drop(${dragged.node.id}) => to:`, this.node.id);
// 		// this.node = {...dragged.node, isDragging: false};
// 		this.node.tree.state.move({...dragged.node, isDragging: false}, {parent: this.node.parent, index: this.node.index});
// 	}
//
// 	private hover = (monitor: DropTargetMonitor<IDraggedTreeItem<Item>>): void => {
// 		if (monitor.isOver({shallow: true})) {
// 			const dragged = monitor.getItem();
// 			if (!monitor.canDrop()) {
// 				return;
// 			}
// 			const draggedNode = dragged.node;
// 			if (draggedNode.id === this.node.id) {
// 				return;
// 			}
// 			// console.log('hover() - will place preview', dragged);
// 			this.node.tree.state.placePreview(dragged.node, {
// 				parent: this.node.parent,
// 				index: this.node.index
// 			});
// 		}
// 	}
//
// 	private rect() {
// 		if (!this.el) {
// 			throw new Error('[dndTreeItem] expected to be attached to a real DOM element');
// 		}
// 		return this.el.nativeElement.getBoundingClientRect();
// 	}
//
// 	/** @ignore */
// 	private size(): ISize {
// 		const rect = this.rect();
// 		const width = rect.width || rect.right - rect.left;
// 		const height = rect.height || rect.bottom - rect.top;
// 		return {width, height};
// 	}
//
//
// 	private canDrop = (m: DropTargetMonitor<IDraggedTreeItem<Item>>, dropTargetNode: ITreeNode<Item>): boolean => {
//
// 		const dragged = m.getItem();
// 		const draggedNode = dragged.node;
// 		const draggedTreeSpec = draggedNode.tree.spec;
// 		const draggedData = draggedNode.data;
// 		const draggedItemId = draggedTreeSpec.itemId(draggedData);
//
// 		if (this.lastCantDropDraggedId === draggedItemId) {
// 			return !this.lastCantDropReason;
// 		}
//
// 		const dropTargetTreeSpec = dropTargetNode.tree.spec;
// 		const dropTargetData = dropTargetNode.data;
// 		const dropTargetItemId = dropTargetTreeSpec.itemId(dropTargetData);
//
// 		let cantDropReason = ''; // draggedItemId === dropTargetItemId && 'to itself';
// 		if (!cantDropReason) {
// 			cantDropReason = dropTargetTreeSpec.getChildren(dropTargetData)?.some(v => dropTargetTreeSpec.itemId(v) === draggedItemId) && 'to the same parent'
// 		}
// 		if (!cantDropReason) {
// 			cantDropReason = draggedTreeSpec.getChildren(draggedData)?.some(v => draggedTreeSpec.itemId(v) === dropTargetItemId) && 'to child';
// 		}
// 		if (cantDropReason && this.lastCantDropReason !== cantDropReason) {
// 			console.log('Can not drop ' + cantDropReason);
// 		}
// 		this.lastCantDropReason = cantDropReason;
// 		this.lastCantDropDraggedId = draggedItemId;
// 		console.log(`canDrop =>`,
// 			`dragged: ${draggedNode.index}, target: ${dropTargetNode.id}`,
// 			`=> ${cantDropReason ? `Can not drop ` + cantDropReason : 'YES'}`);
// 		return !cantDropReason;
// 	};
//
// }
