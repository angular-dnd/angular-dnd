import {ITreeContext, ITreeNode} from '@sneat-team/dnd-tree';
import {TemplateRef} from '@angular/core';

export interface IAngularDndTreeContext<Item> extends ITreeContext<Item> {
  readonly itemTemplate: TemplateRef<ITreeNode<Item>>;
}
