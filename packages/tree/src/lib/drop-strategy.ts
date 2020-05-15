import {
	IDndTreeSpec,
	IDraggedTreeItem,
	IDropHovered,
	IDropStrategy,
	IDropTargetPosition,
	ITreeState
} from './interfaces-dnd';
import {DropTargetMonitor, Offset} from '@angular-dnd/core';
import {ChildrenSizeMode} from './interfaces-tree';

export class DefaultDropStrategy<Item> implements IDropStrategy<Item> {

	// private lastCantDropReason: string;
	// private lastCantDropDraggedId: Id;

	public canDrop(
		m: DropTargetMonitor<IDraggedTreeItem<Item>>,
		to: IDropTargetPosition<Item>,
		_: ITreeState<Item>, // dropTreeState
	): boolean {
		return !!to;
	}

	public suggestDropPosition(
		monitor: DropTargetMonitor<IDraggedTreeItem<Item>>,
		hovered: IDropHovered<Item>,
	): IDropTargetPosition<Item> {
		const dragged = monitor.getItem();
		console.log(`suggestDropPosition() for "${dragged.node.id}" hovered over "${hovered.node.id}" (level=${hovered.node.level})`);

		// if (this.lastCantDropDraggedId === draggedItemId) {
		// 	return undefined;
		// }

		// if (hovered.node.id === 'todo') {
		// 	debugger;
		// }

		if (dragged.node.id === hovered.node.id) {
			return {parent: hovered.node.parent, index: hovered.node.index}
		}

		// if (
		// 	hovered.node.parent === dragged.node.parent
		// 	&& hovered.node.level === dragged.node.level
		// 	&& hovered.node.children?.length) {
		// 	console.log('suggested 1')
		// 	return {parent: hovered.node.id, index: hovered.node.children.length};
		// }

		const clientOffset = monitor.getClientOffset();
		const spec = hovered.node.tree.spec as IDndTreeSpec<Item>;
		if (hovered.node.level === 2) {
			console.log('spec.maxDepth:', spec.maxDepth)
		}

		if (!spec.maxDepth || hovered.node.level < spec.maxDepth) {
			return this.suggestTripleWay(dragged, hovered, clientOffset);
		}
		const childrenSize = spec.childrenSize && spec.childrenSize(hovered.node.tree.state.node(hovered.node.parent));
		// console.log('childrenSize:', childrenSize);
		return childrenSize === ChildrenSizeMode.fixed
			? this.suggestImmediate(dragged, hovered, clientOffset)
			: this.suggestHalfway(dragged, hovered, clientOffset);
	}

	// This is for nodes of fixed size that can't have children
	suggestImmediate(dragged: IDraggedTreeItem<Item>, hovered: IDropHovered<Item>, _: Offset): IDropTargetPosition<Item> {
		const draggedNode = dragged.node;
		const hoveredNode = hovered.node;
		const {parent} = hoveredNode;

		let result: IDropTargetPosition<Item>;

		if (draggedNode.id === hoveredNode.id) {
			result = {parent, index: hoveredNode.index};
		} else if (draggedNode.parent === hoveredNode.id) {
			result = {parent, index: hoveredNode.index + 1}
		} else {
			result = {parent, index: hoveredNode.index};
		}
		return result;
	}

	// This is for nodes of variable size that can't have children
	suggestHalfway(dragged: IDraggedTreeItem<Item>, hovered: IDropHovered<Item>, clientOffset: Offset): IDropTargetPosition<Item> {
		const {dim, mouse, start} = this.coordinates(hovered, clientOffset)
		const targetCentre = start + dim / 2.0;
		const topHalf = mouse < targetCentre;
		let index: number; // suggestedIndex
		const hoveredIndex = hovered.node.index;
		const {parent} = hovered.node;
		if (dragged.node.parent === parent) {
			if (dragged.node.id === hovered.node.id) {
				index = hoveredIndex;
			} else if (hoveredIndex < dragged.node.index) {
				index = topHalf ? hoveredIndex : hoveredIndex + 1;
			} else {
				index = topHalf ? hoveredIndex - 1 : hoveredIndex;
			}
		} else {
			// first hover on a different list;
			// there is no relevant hover.index to compare to
			index = topHalf ? hoveredIndex : hoveredIndex + 1;
		}
		const result: IDropTargetPosition<Item> = {parent, index};
		console.log('suggestHalfway', hovered.node.id, result, '- inner item');
		return result;
	}

	// This is for nodes that can accept new children
	suggestTripleWay(dragged: IDraggedTreeItem<Item>, hovered: IDropHovered<Item>, clientOffset: Offset): IDropTargetPosition<Item> {
		const {dim, mouse, start} = this.coordinates(hovered, clientOffset);
		const padding = 10;
		let result: IDropTargetPosition<Item>;
		const draggedId = dragged.node.id;
		let branch: string;
		const hoveredNode = hovered.node; // .tree.state.node(hovered.node.id);
		const draggedNode = hoveredNode.tree.state.node(draggedId);
		if (mouse < start + padding) {
			if (hovered.node.children?.some(child => child === draggedId)) {
				result = {
					parent: hoveredNode.parent,
					index: hoveredNode.parent === draggedNode.parent && hoveredNode.index > draggedNode.index
						? hoveredNode.index - 1
						: hoveredNode.index
				};
				if (result.index === 4) {
					console.warn('suxx', result, hovered.node, draggedNode);
				}
				branch = 'top/parent';
			} else {
				result = {parent: hovered.node.id, index: 0};
				branch = 'top/hovered';
			}
		} else if (mouse > start + dim - padding) {
			if (hovered.node.children?.some(child => child === draggedId)) {
				result = {parent: hovered.node.parent, index: hovered.node.index + 1};
				branch = 'bottom/parent';
			} else {
				result = {parent: hovered.node.id, index: hovered.node.children?.length || 0};
				branch = 'bottom/hovered';
			}
		} else {
			result = {parent: draggedNode.parent, index: draggedNode.index}; // Do not change position, return current from latest state
			// result = this.suggestHalfway(dragged, hovered, clientOffset); // Temporary, while not implemented dropping into node
			branch = 'inner';
		}
		console.log(`suggestTripleWay() for "${draggedId}" hovered over "${hovered.node.id}" (level=${hovered.node.level}) suggested`, result, `- branch: ${branch}`);
		return result;
	}

	private coordinates(hovered: IDropHovered<Item>, clientOffset: Offset): { dim: number, mouse: number, start: number } {
		const rect = hovered.rect();
		const isHorizontal = hovered.node.childrenDirection === 'horizontal';
		const dim = isHorizontal
			? (rect.width || rect.right - rect.left)
			: (rect.height || rect.bottom - rect.top);
		const start = isHorizontal ? rect.left : rect.top;
		const mouse = isHorizontal ? clientOffset.x : clientOffset.y;
		return {dim, mouse, start}
	}
}
