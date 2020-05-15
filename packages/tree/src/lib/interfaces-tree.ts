import {TemplateRef} from '@angular/core';
import {Observable} from 'rxjs';
import {DropTarget} from '@angular-dnd/core';
import {IDraggedTreeItem, ITreeState} from './interfaces-dnd';

export type Id = string;

export interface ITree<Data> {
	readonly id: Id;
	items?: Data[];
}

export interface ITreeContext<Item> {
	readonly id: Id; // Tree ID
	readonly spec: ITreeSpec<Item>;
	readonly state: ITreeState<Item>;
	readonly itemTemplate: TemplateRef<ITreeNode<Item>>;
}

export interface ITreeNode<Item> {
	readonly id: Id;
	readonly tree: ITreeContext<Item>;
	readonly level: number;
	readonly parent?: Id;
	readonly children?: readonly string[];
	readonly index?: number;
	readonly hasChildren?: boolean;
	readonly childrenCount?: number;
	readonly data: Item;
	readonly isExpanded?: boolean;
	readonly isDragging?: boolean;
	readonly dropTarget?: DropTarget<IDraggedTreeItem<Item>>;
	readonly $isOver?: Observable<boolean>;
	readonly changed: Observable<ITreeNode<Item>>;
	readonly childrenDirection?: 'vertical' | 'horizontal'; // Default is vertical
}

export enum ChildrenSizeMode {
	fixed = 'fixed',
	flexible = 'flexible',
}

export interface ITreeSpec<Item> {
	readonly autoExpand?: (node: ITreeNode<Item>) => boolean;
	readonly itemId: (item: Item) => Id;
	readonly hasChildren?: (item: Item) => boolean | undefined;
	readonly childrenCount?: (item: Item) => number | undefined;
	readonly getChildItems?: (item: Item) => Item[] | undefined;
}
